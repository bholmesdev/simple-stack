import {
	createComponent,
	renderComponent,
	render,
} from "astro/runtime/server/index.js";
import { type scope as scopeFn } from "simple:scope";

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
