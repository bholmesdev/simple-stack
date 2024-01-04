/** @jsxImportSource solid-js */
import { type JSX, Show } from "solid-js";
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
	optIn: z.boolean().optional(),
});

export default function Signup(props: {
	serverErrors?: FieldErrors<typeof signup>;
}) {
	return (
		<Form
			class="flex flex-col gap-2 items-start"
			fieldErrors={props.serverErrors}
			validator={signup.validator}
			name="signupSolid"
		>
			<FormGroup>
				<label for={scope("name")}>Name</label>
				<Input id={scope("name")} {...signup.inputProps.username} />
			</FormGroup>
			<FormGroup>
				<label for={scope("optIn")}>Opt in</label>
				<Input id={scope("optIn")} {...signup.inputProps.optIn} />
			</FormGroup>
			<button
				type="submit"
				class="bg-purple-700 rounded px-5 py-2 disabled:bg-purple-900"
			>
				Submit
			</button>
			<Loading />
		</Form>
	);
}

function FormGroup(props: { children: JSX.Element }) {
	return <div class="flex gap-3 items-center">{props.children}</div>;
}

function Loading() {
	const formContext = useFormContext();
	return (
		<Show when={formContext.value().isSubmitPending}>
			<p>{formContext.value().submitStatus}</p>
		</Show>
	);
}
