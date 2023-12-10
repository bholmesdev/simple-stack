import type { ValidRedirectStatus } from "astro";
import { defineMiddleware } from "astro/middleware";
import type { ZodRawShape } from "zod";
import { validateForm } from "./module";

const formContentTypes = [
	"application/x-www-form-urlencoded",
	"multipart/form-data",
];

function isFormRequest(request: Request) {
	return (
		request.method === "POST" &&
		formContentTypes.some((t) =>
			request.headers.get("content-type")?.startsWith(t),
		)
	);
}

export type SearchParams = Record<
	string,
	string | number | boolean | undefined
>;

export type PartialRedirectPayload = {
	status: ValidRedirectStatus;
	location: string;
};

export const onRequest = defineMiddleware(({ request, locals }, next) => {
	locals.form = {
		async getData(form: { validator: ZodRawShape }) {
			if (!isFormRequest(request)) return undefined;

			// TODO: hoist exceptions as `formErrors`
			const formData = await request.clone().formData();

			return validateForm(formData, form.validator);
		},
		async getDataByName(name: string, form: { validator: ZodRawShape }) {
			if (!isFormRequest(request)) return undefined;

			// TODO: hoist exceptions as `formErrors`
			const formData = await request.clone().formData();

			if (formData.get("_formName") === name) {
				formData.delete("_formName");
				return validateForm(formData, form.validator);
			}

			return undefined;
		},
	};

	next();
});
