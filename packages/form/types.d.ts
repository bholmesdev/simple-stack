declare module "simple:form" {
	export * from "simple-stack-form/module";
}

declare namespace App {
	type FormValidator = import("simple-stack-form/module").FormValidator;
	type GetDataResult<T extends FormValidator> =
		| {
				data: import("zod").output<import("zod").ZodObject<T>>;
				fieldErrors: undefined;
		  }
		| {
				data: undefined;
				fieldErrors: import("zod").ZodError<
					import("zod").output<import("zod").ZodObject<T>>
				>["formErrors"]["fieldErrors"];
		  };

	interface Locals {
		form: {
			getData<T extends { validator: FormValidator }>(
				form: T,
			): Promise<GetDataResult<T["validator"]> | undefined>;
			getDataByName<T extends { validator: FormValidator }>(
				name: string,
				form: T,
			): Promise<GetDataResult<T["validator"]> | undefined>;
		};
	}
}
