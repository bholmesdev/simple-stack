/// <reference types="astro/client" />
import type { SuspenseGlobalCtx } from "../src/suspense-context";

declare global {
	namespace App {
		interface Locals {
			suspense: SuspenseGlobalCtx;
		}
	}
}
