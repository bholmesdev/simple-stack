// Generated by simple:form

import { navigate } from "astro:transitions/client";
import {
	type FieldErrors,
	type FormState,
	type FormValidator,
	formNameInputProps,
	getInitialFormState,
	toSetValidationErrors,
	toTrackAstroSubmitStatus,
	toValidateField,
	validateForm,
} from "simple:form";
import { type ComponentProps, createContext } from "preact";
import { useContext, useState } from "preact/hooks";

export function useCreateFormContext(
	validator: FormValidator,
	fieldErrors?: FieldErrors,
) {
	const initial = getInitialFormState({ validator, fieldErrors });
	const [formState, setFormState] = useState<FormState>(initial);
	return {
		value: formState,
		set: setFormState,
		setValidationErrors: toSetValidationErrors(setFormState),
		validateField: toValidateField(setFormState),
		trackAstroSubmitStatus: toTrackAstroSubmitStatus(setFormState),
	};
}

export function useFormContext() {
	const formContext = useContext(FormContext);
	if (!formContext) {
		throw new Error(
			"Form context not found. `useFormContext()` should only be called from children of a <Form> component.",
		);
	}
	return formContext;
}

type FormContextType = ReturnType<typeof useCreateFormContext>;

const FormContext = createContext<FormContextType | undefined>(undefined);

export function Form({
	children,
	validator,
	context,
	fieldErrors,
	name,
	...formProps
}: {
	validator: FormValidator;
	context?: FormContextType;
	fieldErrors?: FieldErrors;
} & Omit<ComponentProps<"form">, "method" | "onSubmit">) {
	const formContext = context ?? useCreateFormContext(validator, fieldErrors);

	return (
		<FormContext.Provider value={formContext}>
			<form
				{...formProps}
				method="POST"
				onSubmit={async (e) => {
					e.preventDefault();
					e.stopPropagation();
					const formData = new FormData(e.currentTarget);
					formContext.set((formState) => ({
						...formState,
						isSubmitPending: true,
						submitStatus: "validating",
					}));
					const parsed = await validateForm({ formData, validator });
					if (parsed.data) {
						const action =
							typeof formProps.action === "string"
								? formProps.action
								: // Check for Preact signals
									formProps.action?.value ?? "";
						navigate(action, { formData });
						return formContext.trackAstroSubmitStatus();
					}

					formContext.setValidationErrors(parsed.fieldErrors);
				}}
			>
				{name ? <input {...formNameInputProps} value={name} /> : null}
				{children}
			</form>
		</FormContext.Provider>
	);
}

export function Input(inputProps: ComponentProps<"input"> & { name: string }) {
	const formContext = useFormContext();
	const fieldState = formContext.value.fields[inputProps.name];
	if (!fieldState) {
		throw new Error(
			`Input "${inputProps.name}" not found in form. Did you use the <Form> component?`,
		);
	}

	const { hasErroredOnce, validationErrors, validator } = fieldState;
	return (
		<>
			<input
				onBlur={async (e) => {
					const value = e.currentTarget.value;
					if (value === "") return;
					formContext.validateField(inputProps.name, value, validator);
				}}
				onInput={async (e) => {
					if (!hasErroredOnce) return;
					const value = e.currentTarget.value;
					formContext.validateField(inputProps.name, value, validator);
				}}
				{...inputProps}
			/>
			{validationErrors?.map((e) => (
				<p key={e}>{e}</p>
			))}
		</>
	);
}
