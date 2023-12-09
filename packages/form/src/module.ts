import { atom } from "nanostores";
import {
  z,
  ZodBoolean,
  ZodNumber,
  ZodOptional,
  type ZodRawShape,
  type ZodType,
} from "zod";

export type FormValidator = import("zod").ZodRawShape;

export type InputProp = {
  "aria-required": boolean;
  name: string;
  type: "text" | "number" | "checkbox";
};

export type FieldState = {
  hasErrored: boolean;
  validationErrors: string[];
  validator: import("zod").ZodType;
};

export type FormState<TKey extends string | number | symbol = string> = {
  fields: Record<TKey, FieldState>;
  containsErrors: boolean;
};

export type FormStore<T extends FormValidator = FormValidator> =
  import("nanostores").Atom<FormState<keyof T>> & {
    setFieldState(key: string, value: FieldState): void;
    setValidationErrors(error: import("zod").ZodError<unknown>): void;
  };

export function createForm<T extends ZodRawShape>(validator: T) {
  let inputProps: Record<keyof T, any> = {} as any;
  for (const [name, fieldValidator] of Object.entries(validator)) {
    inputProps[name as keyof typeof validator] = getInputProp(
      name,
      fieldValidator
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
              validator
            ),
          ];
        default:
          return [key, validator];
      }
    })
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

  return { fields, containsErrors: false };
}

export const createFormStore = <T extends ZodRawShape>(
  formValidator: T
): FormStore<T> => {
  const store = atom(formValidatorToState(formValidator));
  return {
    ...store,
    setFieldState(key, value) {
      const $store = store.get();
      const fields = { ...$store.fields, [key]: value };
      const containsErrors = Object.values(fields).some(
        (f) => f.validationErrors.length > 0
      );
      store.set({ ...$store, containsErrors, fields });
    },
    setValidationErrors(error) {
      const $store = store.get();

      for (const { path: errorPath } of error.errors) {
        // TODO: support nested paths
        const key = errorPath[0]?.toString();
        if (!key) continue;
        const fieldValidator = $store.fields[key];
        if (!fieldValidator) continue;

        this.setFieldState(key, {
          ...fieldValidator,
          hasErrored: true,
          validationErrors: [error.message],
        });
      }
    },
  };
};

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

export function validateForm<T extends ZodRawShape>(
  formData: FormData,
  validator: T
) {
  const result = z
    .preprocess((formData) => {
      if (!(formData instanceof FormData)) return formData;

      // TODO: handle multiple inputs with same key
      return Object.fromEntries(formData);
    }, z.object(validator))
    .safeParse(formData);

  return result;
}