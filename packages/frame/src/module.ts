export function resolveProps<T extends Record<string, unknown>>({
	request,
	props,
}: {
	request: Request;
	props: T;
}): T {
	return {
		...props,
		...JSON.parse(request.headers.get("x-frame-props") ?? "{}"),
	};
}
