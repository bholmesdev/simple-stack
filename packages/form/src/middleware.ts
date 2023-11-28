import type { ValidRedirectStatus } from "astro";
import { z, type ZodRawShape } from "astro/zod";
import { defineMiddleware } from "astro:middleware";

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

function validate<T extends ZodRawShape>(formData: FormData, validator: T) {
  const result = z
    .preprocess((formData) => {
      if (!(formData instanceof FormData)) return formData;
      // TODO: map multiple form values of the same name
      return Object.fromEntries(formData.entries());
    }, z.object(validator))
    .safeParse(formData);

  return result;
}

export const onRequest = defineMiddleware(({ request, locals }, next) => {
  locals.form = {
    // @ts-expect-error generics don't line up with `types.d.ts`
    async getData<T extends ZodRawShape>(validator: T) {
      if (!isFormRequest(request)) return undefined;

      // TODO: hoist exceptions as `formErrors`
      const formData = await request.clone().formData();

      return validate<T>(formData, validator);
    },
    // @ts-expect-error generics don't line up with `types.d.ts`
    async getDataByName<T extends ZodRawShape>(name: string, validator: T) {
      if (!isFormRequest(request)) return undefined;

      // TODO: hoist exceptions as `formErrors`
      const formData = await request.clone().formData();

      if (formData.get("_formName") === name) {
        formData.delete("_formName");
        return validate<T>(formData, validator);
      }

      return undefined;
    },
  };

  next();
});
