import { defineConfig } from "astro/config";
import simpleStackQuery from "simple-stack-query";

export default defineConfig({
	integrations: [simpleStackQuery()],
});
