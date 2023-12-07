import { map, type MapStore } from "nanostores";
import {
  z,
  ZodBoolean,
  ZodNumber,
  ZodOptional,
  type ZodRawShape,
  type ZodType,
} from "zod";

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

export type FieldState = {
  hasErrored: boolean;
  validationErrors: string[];
  validator: ZodType;
};

export function createFormStore<T extends ZodRawShape>(
  formValidator: T
): MapStore<Record<string, FieldState>> {
  return map(
    Object.fromEntries(
      Object.entries(formValidator).map(([key, validator]) => [
        key,
        {
          hasErrored: false,
          validationErrors: [],
          validator,
        },
      ])
    )
  );
}

type InputProp = {
  name: string;
  "aria-required": boolean;
  type: "text" | "number" | "checkbox";
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
