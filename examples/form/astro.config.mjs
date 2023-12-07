import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";
import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [simpleStackForm(), react()],
  adapter: node({
    mode: "standalone"
  })
});