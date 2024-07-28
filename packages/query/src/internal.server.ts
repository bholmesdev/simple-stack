import { type scope as scopeFn } from "simple:scope";
import {
	createComponent,
	render,
	renderComponent,
} from "astro/runtime/server/index.js";

export const createRootElement = (scope: typeof scopeFn) =>
	createComponent({
		factory(result, { data, ...props }, slots) {
			return render`${renderComponent(
				result,
				"RootElement",
				`simple-query-root-${scope()}`,
				{
					style: props.class ? "" : "display: contents",
					...props,
					"data-stringified": JSON.stringify(data),
				},
				slots,
			)}`;
		},
	});
