declare module "my:test" {
  export * from "simple-stack-form/dist/module.js";
}

declare module "simple:form" {
  export type FormValidator = import("zod").ZodRawShape;

  export type InputProp = {
    "aria-required": boolean;
    name: string;
    type: "text" | "number" | "checkbox";
  };

  export function createForm<T extends FormValidator>(
    validator: T
  ): {
    inputProps: Record<keyof T, InputProp>;
  };

  export type FieldState = {
    hasErrored: boolean;
    validationErrors: string[];
    validator: import("zod").ZodType;
  };

  export type FormState<TKey extends string | number | symbol = string> = {
    fields: Record<TKey, FieldState>;
    containsErrors: boolean;
  };

  export function formValidatorToState<T extends FormValidator>(
    formValidator: T
  ): {
    fields: { [FieldName in keyof T]: FieldState };
    containsErrors: boolean;
  };

  export type FormStore<T extends FormValidator = FormValidator> =
    import("nanostores").Atom<FormState<keyof T>> & {
      setFieldState(key: string, value: FieldState): void;
      setValidationErrors(error: import("zod").ZodError<unknown>): void;
    };

  export function createFormStore<T extends FormValidator>(
    formValidator: T
  ): FormStore<T>;

  export function validateForm<T extends FormValidator>(
    formData: FormData,
    validator: T
  ): import("astro/zod").SafeParseReturnType<
    import("astro/zod").input<import("astro/zod").ZodObject<T>>,
    import("astro/zod").output<import("astro/zod").ZodObject<T>>
  >;
}

declare namespace App {
  interface Locals {
    form: {
      getData<T extends { validator: import("astro/zod").ZodRawShape }>(
        form: T
      ): Promise<
        | import("astro/zod").SafeParseReturnType<
            import("astro/zod").input<import("astro/zod").ZodObject<T>>,
            import("astro/zod").output<import("astro/zod").ZodObject<T>>
          >
        | undefined
      >;
      getDataByName<T extends { validator: import("astro/zod").ZodRawShape }>(
        name: string,
        form: T
      ): Promise<
        | import("astro/zod").SafeParseReturnType<
            import("astro/zod").input<import("astro/zod").ZodObject<T>>,
            import("astro/zod").output<import("astro/zod").ZodObject<T>>
          >
        | undefined
      >;
    };
  }
}
