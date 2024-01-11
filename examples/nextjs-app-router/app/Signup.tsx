"use client";

import { Form, Input } from "../components/Form";
import { type FieldErrors } from "simple-stack-form/module";
import { signup } from "./page";
import { signupSubmit } from "./action";

export default function Signup({
	serverErrors,
}: { serverErrors?: FieldErrors<typeof signup> }) {
	// TODO: call React's `useFormState()` to render server errors
	// Maybe `useFormState()` should be called in `Form.tsx`?
	// Should we also update `submitStatus` on the context when the form is submitted?
	return (
		<Form
			action={signupSubmit}
			className="flex flex-col gap-2 items-start"
			fieldErrors={serverErrors}
			validator={signup.validator}
			name="signupReact"
		>
			<FormGroup>
				<label htmlFor="name">Name</label>
				<Input id="name" {...signup.inputProps.username} />
			</FormGroup>
			<FormGroup>
				<label htmlFor="optIn">Opt in</label>
				<Input id="optIn" {...signup.inputProps.optIn} />
			</FormGroup>
			<button
				type="submit"
				className="bg-purple-700 rounded px-5 py-2 disabled:bg-purple-900"
			>
				Submit
			</button>
		</Form>
	);
}

function FormGroup({ children }: { children: React.ReactNode }) {
	return <div className="flex gap-3 items-center">{children}</div>;
}
