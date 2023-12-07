declare namespace App {
  interface Locals {
    form: {
      parseRequest<T extends { validator: import("astro/zod").ZodRawShape }>(
        form: T
      ): Promise<
        | import("astro/zod").SafeParseReturnType<
            import("astro/zod").input<
              import("astro/zod").ZodObject<T["validator"]>
            >,
            import("astro/zod").output<
              import("astro/zod").ZodObject<T["validator"]>
            >
          >
        | undefined
      >;
      getData<T extends import("astro/zod").ZodRawShape>(
        validator: T
      ): Promise<
        | import("astro/zod").SafeParseReturnType<
            import("astro/zod").input<import("astro/zod").ZodObject<T>>,
            import("astro/zod").output<import("astro/zod").ZodObject<T>>
          >
        | undefined
      >;
      getDataByName<T extends import("astro/zod").ZodRawShape>(
        name: string,
        validator: T
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
