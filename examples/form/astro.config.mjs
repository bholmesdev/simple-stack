import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";
import react from "@astrojs/react";
import node from "@astrojs/node";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [simpleStackForm(), react(), tailwind()],
  adapter: node({
    mode: "standalone"
  })
});