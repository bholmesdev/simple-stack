import {
	createComponent,
	renderComponent,
	render,
} from "astro/runtime/server/index.js";
import { type scope as scopeFn } from "simple:scope";

export const createRootElement = (scope: typeof scopeFn) =>
	createComponent({
		factory(result, props, slots) {
			return render`${renderComponent(
				result,
				"RootElement",
				"simple-query-root",
				{
					"data-stringified": JSON.stringify(props),
					"data-scope-hash": scope(),
				},
				slots,
			)}`;
		},
	});
