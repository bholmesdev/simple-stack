import { z } from "zod";
import { Form, Input, useFormContext } from "./Form";
import { type FieldErrors, createForm } from "simple:form";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const signup = createForm({
	username: z
		.string()
		.min(2)
		.refine(async (s) => {
			await sleep(400);
			return s !== "admin";
		}),
	optIn: z.boolean().optional(),
});

export default function Signup({
	serverErrors,
}: { serverErrors?: FieldErrors<typeof signup> }) {
	return (
		<Form
			className="flex flex-col gap-2 items-start"
			serverErrors={serverErrors}
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
				className="bg-purple-700 rounded px-5 py-2 disabled:bg-purple-900"
			>
				Submit
			</button>
			<Loading />
		</Form>
	);
}

function FormGroup({ children }: { children: React.ReactNode }) {
	return <div className="flex gap-3 items-center">{children}</div>;
}

function Loading() {
	const { value } = useFormContext();
	return value.isSubmitPending ? <p>{value.submitStatus}</p> : null;
}
