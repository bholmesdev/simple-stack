/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		suspend(promise: Promise<string>): number;
	}
}
