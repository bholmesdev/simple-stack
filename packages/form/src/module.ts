import {
	z,
	ZodBoolean,
	ZodNumber,
	ZodOptional,
	type ZodError,
	type ZodRawShape,
	type ZodType,
} from "zod";

export { default as mapObject } from "just-map-object";

export type FormValidator = ZodRawShape;

export type InputProp = {
	"aria-required": boolean;
	name: string;
	type: "text" | "number" | "checkbox";
};

export type FieldState = {
	hasErrored: boolean;
	validator: ZodType;
	validationErrors: string[] | undefined;
};

export type FormState<TKey extends string | number | symbol = string> = {
	fields: Record<TKey, FieldState>;
	hasFieldErrors: boolean;
};

export function createForm<T extends ZodRawShape>(validator: T) {
	let inputProps: Record<keyof T, any> = {} as any;
	for (const [name, fieldValidator] of Object.entries(validator)) {
		inputProps[name as keyof typeof validator] = getInputProp(
			name,
			fieldValidator,
		);
	}

	return {
		inputProps,
		validator: preprocessValidators(validator),
	};
}

function preprocessValidators<T extends ZodRawShape>(formValidator: T) {
	return Object.fromEntries(
		Object.entries(formValidator).map(([key, validator]) => {
			const inputType = getInputType(validator);
			switch (inputType) {
				case "checkbox":
					return [key, z.preprocess((value) => value === "on", validator)];
				case "number":
					return [key, z.preprocess(Number, validator)];
				case "text":
					return [
						key,
						z.preprocess(
							// Consider empty input as "required"
							(value) => (value === "" ? undefined : value),
							validator,
						),
					];
				default:
					return [key, validator];
			}
		}),
	) as T;
}

export function formValidatorToState<T extends ZodRawShape>(formValidator: T) {
	let fields: { [FieldName in keyof T]: FieldState } = {} as any;

	for (const key in formValidator) {
		fields[key] = {
			hasErrored: false,
			validationErrors: [],
			validator: formValidator[key]!,
		};
	}

	return { fields, hasFieldErrors: false };
}

export function toSetFieldState<T extends FormState>(
	formState: T | (() => T),
	setFormState: (formState: T) => void,
) {
	return (key: string, value: FieldState) => {
		const $formState =
			typeof formState === "function" ? formState() : formState;
		const fields = { ...$formState.fields, [key]: value };
		const hasFieldErrors = Object.values(fields).some(
			(f) => f.validationErrors?.length,
		);
		setFormState({ ...$formState, hasFieldErrors, fields });
	};
}

export function toSetValidationErrors<T extends FormState>(
	formState: T | (() => T),
	setFormState: (formState: T) => void,
) {
	const setFieldState = toSetFieldState(formState, setFormState);
	return (
		fieldErrors: ZodError<Record<string, unknown>>["formErrors"]["fieldErrors"],
	) => {
		const $formState =
			typeof formState === "function" ? formState() : formState;

		for (const [key, validationErrors] of Object.entries(fieldErrors)) {
			const fieldValidator = $formState.fields[key];
			if (!fieldValidator) continue;

			setFieldState(key, {
				...fieldValidator,
				hasErrored: true,
				validationErrors,
			});
		}
	};
}

function getInputProp<T extends ZodType>(name: string, fieldValidator: T) {
	const inputProp: InputProp = {
		name,
		"aria-required":
			!fieldValidator.isOptional() && !fieldValidator.isNullable(),
		type: getInputType<T>(fieldValidator),
	};

	return inputProp;
}

function getInputType<T extends ZodType>(fieldValidator: T): InputProp["type"] {
	const resolvedType =
		fieldValidator instanceof ZodOptional
			? fieldValidator._def.innerType
			: fieldValidator;

	if (resolvedType instanceof ZodBoolean) {
		return "checkbox";
	} else if (resolvedType instanceof ZodNumber) {
		return "number";
	} else {
		return "text";
	}
}

export async function validateForm<T extends ZodRawShape>(
	formData: FormData,
	validator: T,
) {
	const result = await z
		.preprocess((formData) => {
			if (!(formData instanceof FormData)) return formData;

			// TODO: handle multiple inputs with same key
			return Object.fromEntries(formData);
		}, z.object(validator))
		.safeParseAsync(formData);

	if (result.success) {
		return { data: result.data, fieldErrors: undefined };
	}
	return {
		data: undefined,
		fieldErrors: result.error.formErrors.fieldErrors,
	};
}
