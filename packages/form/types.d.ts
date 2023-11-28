declare namespace App {
  interface Locals {
    form: {
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
