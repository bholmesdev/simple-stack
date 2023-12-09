import { z } from "zod";
import { Form, Input, useCreateFormContext } from "./Form";
import { createForm } from "simple:form";

export const signup = createForm({
	username: z.string().min(2),
	optIn: z.boolean().optional(),
});

export default function Signup() {
	const context = useCreateFormContext(signup.validator);

	return (
		<Form
			className="flex flex-col gap-2 items-start"
			context={context}
			validator={signup.validator}
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
				disabled={context.value.hasFieldErrors}
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
