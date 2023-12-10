// Generated by simple:form

import {
	type FormValidator,
	toSetValidationErrors,
	toTrackSubmitStatus,
	toValidateField,
	validateForm,
	getInitialFormState,
	type FieldErrors,
	type FormState,
} from "simple:form";
import {
	type ComponentProps,
	createContext,
	useContext,
	useState,
} from "react";

export function useCreateFormContext(
	validator: FormValidator,
	serverErrors?: FieldErrors,
) {
	const initial = getInitialFormState(validator, serverErrors);
	const [formState, setFormState] = useState<FormState>(initial);
	return {
		value: formState,
		set: setFormState,
		setValidationErrors: toSetValidationErrors(setFormState),
		validateField: toValidateField(setFormState),
		trackSubmitStatus: toTrackSubmitStatus(setFormState),
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
	serverErrors,
	...formProps
}: {
	validator: FormValidator;
	context?: FormContextType;
	serverErrors?: FieldErrors;
} & Omit<ComponentProps<"form">, "method" | "onSubmit">) {
	const formContext = context ?? useCreateFormContext(validator, serverErrors);

	return (
		<FormContext.Provider value={formContext}>
			<form
				{...formProps}
				method="POST"
				onSubmit={async (e) => {
					e.preventDefault();
					const formData = new FormData(e.currentTarget);
					formContext.set((formState) => ({
						...formState,
						isSubmitPending: true,
						submitStatus: "validating",
					}));
					const parsed = await validateForm(formData, validator);
					if (parsed.data) {
						return formContext.trackSubmitStatus();
					}

					e.stopPropagation();
					formContext.setValidationErrors(parsed.fieldErrors);
				}}
			>
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
			`Input "${inputProps.name}" not found in form. Did you use the <Form> component with your validator?`,
		);
	}

	const { hasErrored, validationErrors, validator } = fieldState;
	return (
		<>
			<input
				{...inputProps}
				onBlur={async (e) => {
					const value = e.target.value;
					if (value === "") return;
					formContext.validateField(inputProps.name, value, validator);
				}}
				onChange={async (e) => {
					if (!hasErrored) return;
					const value = e.target.value;
					formContext.validateField(inputProps.name, value, validator);
				}}
			/>
			{validationErrors?.map((e) => (
				<p className="text-red-400" key={e}>
					{e}
				</p>
			))}
		</>
	);
}
