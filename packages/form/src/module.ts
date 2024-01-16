import mapValues from "just-map-values";
import {
	ZodArray,
	ZodBoolean,
	type ZodError,
	ZodLiteral,
	ZodNullable,
	ZodNumber,
	ZodObject,
	ZodOptional,
	type ZodRawShape,
	ZodString,
	type ZodType,
	ZodUnion,
	z,
} from "zod";

export type FormValidator = ZodRawShape;
export type FieldErrors<
	T extends { validator: FormValidator } = { validator: FormValidator },
> = ZodError<z.output<ZodObject<T["validator"]>>>["formErrors"]["fieldErrors"];

export type InputProp = {
	"aria-required": boolean;
	name: string;
	type: "text" | "number" | "checkbox" | "email";
};

export const formNameInputProps = {
	type: "hidden",
	name: "_formName",
} as const;

export type FieldState = {
	hasErroredOnce: boolean;
	isValidating: boolean;
	validator: ZodType;
	validationErrors: string[] | undefined;
};

export type FormState<TKey extends string | number | symbol = string> = {
	isSubmitPending: boolean;
	submitStatus: "idle" | "validating" | "submitting";
	hasFieldErrors: boolean;
	fields: Record<TKey, FieldState>;
};

export function createForm<T extends ZodRawShape>(validator: T) {
	return {
		inputProps: mapValues(validator, getInputProp) as Record<
			keyof T,
			InputProp
		>,
		validator: preprocessValidators(validator),
	};
}

export function getInitialFormState({
	validator,
	fieldErrors,
}: {
	validator: FormValidator;
	fieldErrors: FieldErrors | undefined;
}) {
	return {
		hasFieldErrors: false,
		submitStatus: "idle",
		isSubmitPending: false,
		fields: mapValues(validator, (validator, name) => {
			const fieldError = fieldErrors?.[name];
			return {
				hasErroredOnce: !!fieldError?.length,
				validationErrors: fieldError,
				isValidating: false,
				validator,
			};
		}),
	} satisfies FormState;
}

function preprocessValidators<T extends ZodRawShape>(formValidator: T) {
	return Object.fromEntries(
		Object.entries(formValidator).map(([key, validator]) => {
			const inputType = getInputInfo(validator);

			let value = validator;

			switch (inputType.type) {
				case "checkbox":
					value = z.preprocess((value) => value === "on", validator);
					break;
				case "number":
					value = z.preprocess(Number, validator);
					break;
				case "text":
					value = z.preprocess(
						// Consider empty input as "required"
						(value) => (value === "" ? undefined : value),
						validator,
					);
					break;
			}

			if (inputType.isArray) {
				value = z.preprocess((v) => {
					// Support validating a single input against an array validator
					// Use case: input validation on blur
					return Array.isArray(v) ? v : [v];
				}, validator);
			}

			return [key, value];
		}),
	) as T;
}

type Setter<T> = (callback: (previous: T) => T) => void;

function toSetFieldState<T extends FormState>(setFormState: Setter<T>) {
	return (key: string, getValue: (previous: FieldState) => FieldState) => {
		setFormState((formState) => {
			const fieldState = formState.fields[key];
			if (!fieldState) return formState;

			const fields = { ...formState.fields, [key]: getValue(fieldState) };
			const hasFieldErrors = Object.values(fields).some(
				(f) => f.validationErrors?.length,
			);
			return { ...formState, hasFieldErrors, fields };
		});
	};
}

export function toTrackAstroSubmitStatus<T extends FormState>(
	setFormState: Setter<T>,
) {
	return () => {
		setFormState((value) => ({
			...value,
			isSubmitPending: true,
			submitStatus: "submitting",
		}));
		document.addEventListener(
			"astro:after-preparation",
			() =>
				setFormState((value) => ({
					...value,
					isSubmitPending: false,
					submitStatus: "idle",
				})),
			{
				once: true,
			},
		);
	};
}

export function toValidateField<T extends FormState>(setFormState: Setter<T>) {
	const setFieldState = toSetFieldState(setFormState);

	return async (fieldName: string, inputValue: unknown, validator: ZodType) => {
		setFieldState(fieldName, (fieldState) => ({
			...fieldState,
			isValidating: true,
		}));
		const parsed = await validator.safeParseAsync(inputValue);
		if (parsed.success === false) {
			return setFieldState(fieldName, (fieldState) => ({
				...fieldState,
				hasErroredOnce: true,
				isValidating: false,
				validationErrors: parsed.error.errors.map((e) => e.message),
			}));
		}
		setFieldState(fieldName, (fieldState) => ({
			...fieldState,
			isValidating: false,
			validationErrors: undefined,
		}));
	};
}

export function toSetValidationErrors<T extends FormState>(
	setFormState: Setter<T>,
) {
	const setFieldState = toSetFieldState(setFormState);
	return (
		fieldErrors: ZodError<Record<string, unknown>>["formErrors"]["fieldErrors"],
	) => {
		setFormState((formState) => ({
			...formState,
			hasFieldErrors: false,
			submitStatus: "idle",
		}));
		for (const [key, validationErrors] of Object.entries(fieldErrors)) {
			setFieldState(key, (fieldState) => ({
				...fieldState,
				hasErroredOnce: true,
				validationErrors,
			}));
		}
	};
}

function getInputProp<T extends ZodType>(
	fieldValidator: T,
	name: string | number | symbol,
) {
	const inputProp: InputProp = {
		name: String(name),
		"aria-required":
			!fieldValidator.isOptional() && !fieldValidator.isNullable(),
		type: getInputInfo<T>(fieldValidator).type,
	};

	return inputProp;
}

function getInputType<T extends ZodType>(fieldValidator: T): InputProp["type"] {
	if (fieldValidator instanceof ZodBoolean) {
		return "checkbox";
	}

	if (fieldValidator instanceof ZodNumber) {
		return "number";
	}

	if (
		fieldValidator instanceof ZodString &&
		fieldValidator._def.checks.some((check) => check.kind === "email")
	) {
		return "email";
	}

	if (fieldValidator instanceof ZodOptional) {
		return getInputType(fieldValidator._def.innerType);
	}

	if (fieldValidator instanceof ZodUnion) {
		const types: InputProp["type"][] =
			fieldValidator._def.options.map(getInputType);
		if (!types[0]) {
			return "text";
		}
		if (types.every((type) => type === types[0])) {
			return types[0];
		}
		if (
			types.length === 2 &&
			fieldValidator._def.options[1] instanceof ZodLiteral &&
			!fieldValidator._def.options[1].value
		) {
			// Handles specific case where email is optional. E.g.: `z.string().email().optional().or(z.literal(""))`
			return types[0];
		}
	}

	return "text";
}

function getInputInfo<T extends ZodType>(fieldValidator: T): {
	type: InputProp["type"];
	isArray: boolean;
	isOptional: boolean;
} {
	let resolvedType = fieldValidator;
	let isArray = false;
	let isOptional = false;
	if (
		fieldValidator instanceof ZodOptional ||
		fieldValidator instanceof ZodNullable
	) {
		resolvedType = fieldValidator._def.innerType;
		isOptional = true;
	}

	if (fieldValidator instanceof ZodArray) {
		resolvedType = fieldValidator._def.type;
		isArray = true;
	}

	// TODO: respect preprocess() wrappers

	const type = getInputType(resolvedType);

	return { type, isArray, isOptional };
}

export async function validateForm<T extends ZodRawShape>({
	formData,
	validator,
}: {
	formData: FormData;
	validator: T;
}) {
	const result = await z
		.preprocess((formData) => {
			if (!(formData instanceof FormData)) return formData;

			return mapValues(Object.fromEntries(formData), (value, key) => {
				const all = formData.getAll(String(key));
				return all.length > 1 ? all : value;
			});
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
