"use client";

import { signup } from "./page";
import { signupSubmit } from "./action";
import { useFormState } from "./utils";
import { Form, Input } from "../components/Form";
import { useFormStatus } from "react-dom";

export default function Signup() {
	const [state, formAction] = useFormState(signupSubmit);

	return (
		<>
			{state?.data && (
				<div
					className="bg-green-100 mb-4 border border-green-400 text-green-700 px-4 py-3 rounded relative"
					role="alert"
				>
					<strong className="font-bold">Success!</strong>
					<span className="block sm:inline">
						You have successfully submitted the form.
					</span>
				</div>
			)}
			<Form
				action={formAction}
				className="flex flex-col gap-2 items-start"
				fieldErrors={state?.fieldErrors}
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
				<Loading />
			</Form>
		</>
	);
}

function Loading() {
	const { pending } = useFormStatus();
	return pending ? <p>submitting</p> : null;
}

function FormGroup({ children }: { children: React.ReactNode }) {
	return <div className="flex gap-3 items-center">{children}</div>;
}
