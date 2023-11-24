import { defineMiddleware } from "astro:middleware";

const formContentTypes = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
];

function isFormRequest(request: Request) {
  return (
    request.method === "POST" &&
    formContentTypes.includes(request.headers.get("content-type") ?? "")
  );
}

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(({ request, locals }, next) => {
  locals.getFormData = async (type?: string) => {
    if (!isFormRequest(request)) return undefined;
    const formData = request.clone().formData();
    if (!type) return formData;

    const data = await formData;
    if (data.get("type") === type) return data;

    return undefined;
  };
});
