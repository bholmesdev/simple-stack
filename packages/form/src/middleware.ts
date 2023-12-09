import type { ValidRedirectStatus } from "astro";
import { z, type ZodRawShape } from "zod";
import { defineMiddleware } from "astro/middleware";

const formContentTypes = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
];

function isFormRequest(request: Request) {
  return (
    request.method === "POST" &&
    formContentTypes.some((t) =>
      request.headers.get("content-type")?.startsWith(t)
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

function validate(formData: FormData, validator: ZodRawShape) {
  const result = z
    .preprocess((formData) => {
      if (!(formData instanceof FormData)) return formData;
      let mappedObject: Record<string, unknown> = {};

      // TODO: map multiple form values of the same name
      for (const [key, value] of formData.entries()) {
        const fieldValidator = validator[key];
        if (fieldValidator instanceof z.ZodBoolean) {
          mappedObject[key] = value === "true";
        } else if (fieldValidator instanceof z.ZodNumber) {
          mappedObject[key] = Number(value);
        } else {
          mappedObject[key] = value;
        }
      }
      return mappedObject;
    }, z.object(validator))
    .safeParse(formData);

  return result;
}

export const onRequest = defineMiddleware(({ request, locals }, next) => {
  locals.form = {
    async getData(form: { validator: ZodRawShape }) {
      if (!isFormRequest(request)) return undefined;

      // TODO: hoist exceptions as `formErrors`
      const formData = await request.clone().formData();

      return validate(formData, form.validator);
    },
    async getDataByName(name: string, form: { validator: ZodRawShape }) {
      if (!isFormRequest(request)) return undefined;

      // TODO: hoist exceptions as `formErrors`
      const formData = await request.clone().formData();

      if (formData.get("_formName") === name) {
        formData.delete("_formName");
        return validate(formData, form.validator);
      }

      return undefined;
    },
  };

  next();
});
