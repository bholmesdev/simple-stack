import { z } from "zod";
import { Form, Input, useFormContext } from "./Form";
import { type FieldErrors, createForm } from "simple:form";
import { scope } from "simple:scope";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const signup = createForm({
	username: z
		.string()
		.min(2)
		.refine(async (s) => {
			await sleep(400);
			return s !== "admin";
		}),
	email: z.string().email().optional().or(z.literal("")),
	optIn: z.boolean().optional(),
});

export default function Signup({
	serverErrors,
}: { serverErrors?: FieldErrors<typeof signup> }) {
	return (
		<Form
			className="flex flex-col gap-2 items-start"
			fieldErrors={serverErrors}
			validator={signup.validator}
			name="signupReact"
		>
			<FormGroup>
				<label htmlFor={scope("name")}>Name</label>
				<Input id={scope("name")} {...signup.inputProps.username} />
			</FormGroup>
			<FormGroup>
				<label htmlFor={scope("email")}>Email</label>
				<Input id={scope("email")} {...signup.inputProps.email} />
			</FormGroup>
			<FormGroup>
				<label htmlFor={scope("optIn")}>Opt in</label>
				<Input id={scope("optIn")} {...signup.inputProps.optIn} />
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
