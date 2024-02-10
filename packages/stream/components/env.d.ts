/// <reference types="astro/client" />
import type { SuspenseGlobalCtx } from "../components/suspense-context";

declare global {
	namespace App {
		interface Locals {
			suspense: SuspenseGlobalCtx;
		}
	}
}
