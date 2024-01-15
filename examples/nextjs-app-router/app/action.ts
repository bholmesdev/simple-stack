"use server";

import { validateForm } from "simple-stack-form/module";
import { signup } from "./page";

export async function signupSubmit(formData: FormData) {
	const parsed = await validateForm({ formData, validator: signup.validator });
	if (parsed.data) {
		console.info("parsed.data", parsed.data);
	}
	return parsed;
}
