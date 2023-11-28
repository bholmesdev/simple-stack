/** @return {import('astro').AstroIntegration} */
export default function integration() {
  return {
    name: "simple-form",
    hooks: {
      "astro:config:setup"({ addMiddleware }) {
        addMiddleware({
          entrypoint: "simple-stack-form/middleware",
          order: "pre",
        });
      },
    },
  };
}
