import type { AstroIntegration } from "astro";
import { Plugin } from "vite";

export default function simpleStackQueryIntegration(): AstroIntegration {
  return {
    name: 'simple-stack-query',
    hooks: {
      'astro:config:setup'({updateConfig}) {
        updateConfig({
          vite: {
            plugins: [vitePlugin()]
          }
        })
      }
    }
  }
}

function vitePlugin(): Plugin {
  return {
    name: "simple-stack-query",
    transform(code, id) {
      const [baseId, search] = id.split("?");
      if (!baseId?.endsWith(".astro")) return;

      const isAstroFrontmatter = !search;

      if (isAstroFrontmatter) {
        return `
      import { scope } from 'simple:scope';
      const $ = scope;\n${code}`;
      }

      const searchParams = new URLSearchParams(search);
      if (!searchParams.has("lang.ts")) return;

      return `
    import { scope } from 'simple:scope';
    import * as __queryInternals from '/simple-query.mjs';

    const $ = __queryInternals.create$(scope);
    const ready = __queryInternals.createReady(scope);\n${code}`;
    },
  }
}