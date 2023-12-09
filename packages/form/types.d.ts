declare module "simple:form" {
  export * from "simple-stack-form/module";
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
