/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    getFormData(type?: string): Promise<FormData | undefined>;
  }
}
