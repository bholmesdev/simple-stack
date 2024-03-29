import {
	supportsViewTransitions,
	transitionEnabledOnThisPage,
} from "astro/virtual-modules/transitions-router.js";

function setupForms(forms: NodeListOf<HTMLFormElement>) {
	for (const form of forms) {
		let controller: AbortController;
		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (controller) controller.abort();
			controller = new AbortController();

			let frameUrl = form.getAttribute("data-frame");
			if (frameUrl === "") {
				frameUrl = form.closest("simple-frame")?.getAttribute("src") ?? null;
			}
			if (typeof frameUrl !== "string") {
				throw missingUrlError;
			}
			const frame = document.querySelector(`simple-frame[src="${frameUrl}"]`);
			if (!frame) {
				console.warn(`Frame with URL ${frameUrl} not found.`);
				// TODO: decide error handling strategy
				return;
			}
			const headers = new Headers();
			headers.set("Accept", "text/html");
			const stringifiedProps = frame.getAttribute("data-props");
			if (stringifiedProps) headers.set("x-frame-props", stringifiedProps);
			frame.toggleAttribute("data-loading", true);
			form.toggleAttribute("data-loading", true);
			frame.dispatchEvent(new CustomEvent("frame-submit"));
			form.dispatchEvent(new CustomEvent("frame-submit"));
			try {
				let res: Response;
				if (form.method === "POST") {
					res = await fetch(frameUrl, {
						method: "POST",
						body: new FormData(form),
						signal: controller.signal,
						headers,
					});
				} else {
					const searchParams = new URLSearchParams(new FormData(form) as any);
					const shouldMirrorQuery = form.getAttribute("data-mirror-query");
					if (shouldMirrorQuery !== "false") {
						window.history.replaceState(
							{},
							"",
							`${window.location.pathname}?${searchParams}`,
						);
					}

					res = await fetch(`${frameUrl}?${searchParams}`, {
						method: "GET",
						signal: controller.signal,
						headers,
					});
				}
				if (!res.ok) {
					frame.dispatchEvent(new CustomEvent("frame-error", { detail: res }));
					form.dispatchEvent(new CustomEvent("frame-error", { detail: res }));
					return;
				}
				// TODO: handle redirects
				const htmlString = await res.text();
				const incomingContents = new DOMParser().parseFromString(
					htmlString,
					"text/html",
				);
				const render = () => {
					frame.innerHTML = incomingContents.body.innerHTML;
					setupForms(frame.querySelectorAll("form[data-frame]"));
				};

				if (transitionEnabledOnThisPage() && supportsViewTransitions) {
					// @ts-expect-error
					document.startViewTransition(() => render());
				} else {
					render();
				}
				frame.toggleAttribute("data-loading", false);
				form.toggleAttribute("data-loading", false);
				frame.dispatchEvent(new CustomEvent("frame-load"));
				form.dispatchEvent(new CustomEvent("frame-load"));
			} catch (e) {
				if (e instanceof DOMException && e.name === "AbortError") {
					return;
				}
				// TODO: generic error handling
				frame.toggleAttribute("data-loading", false);
				form.toggleAttribute("data-loading", false);
				frame.dispatchEvent(new CustomEvent("frame-load"));
				form.dispatchEvent(new CustomEvent("frame-load"));
				throw e;
			}
		});
	}
}

if (transitionEnabledOnThisPage()) {
	document.addEventListener("astro:page-load", () => {
		setupForms(
			document.querySelectorAll(
				"form[data-frame]",
			) as NodeListOf<HTMLFormElement>,
		);
	});
} else {
	setupForms(
		document.querySelectorAll(
			"form[data-frame]",
		) as NodeListOf<HTMLFormElement>,
	);
}

const missingUrlError = new Error(
	"[simple:frame] Unexpected missing frame URL. The simple-frame web component must be used with the <Frame /> Astro component.",
);
