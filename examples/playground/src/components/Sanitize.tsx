import { z } from "zod";
import { Form, Input, useFormContext } from "./react/Form";
import { type FieldErrors, createForm } from "simple:form";
import sanitizeHtml from 'sanitize-html';

export const sanitize = createForm({
	unsanitized: z.string().optional(),
	sanitized: z.string().optional().transform((dirty) => dirty && sanitizeHtml(dirty)),
});

export default function Sanitize({
	serverErrors,
}: { serverErrors?: FieldErrors<typeof sanitize> }) {
	return (
		<Form
			className="flex flex-col gap-2 items-start"
			fieldErrors={serverErrors}
			validator={sanitize.validator}
			name="sanitize"
		>
			<FormGroup>
				<label htmlFor="sanitized">Sanitized input</label>
				<Input id="sanitized" {...sanitize.inputProps.sanitized} />
			</FormGroup>
			<FormGroup>
				<label htmlFor="unsanitized">Unsanitized input</label>
				<Input id="unsanitized" {...sanitize.inputProps.unsanitized} />
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
