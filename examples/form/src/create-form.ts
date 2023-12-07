import { map, type MapStore } from "nanostores";
import { z, ZodBoolean, ZodNumber, type ZodRawShape, type ZodType } from "zod";

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
    validator,
  };
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
  required: boolean;
  type: "text" | "number" | "checkbox";
};

function getInputProp<T extends ZodType>(name: string, fieldValidator: T) {
  const inputProp: InputProp = {
    name,
    required: !fieldValidator.isOptional() && !fieldValidator.isNullable(),
    type: getInputType<T>(fieldValidator),
  };

  return inputProp;
}
function getInputType<T extends ZodType>(fieldValidator: T): InputProp["type"] {
  if (fieldValidator instanceof ZodBoolean) {
    return "checkbox";
  } else if (fieldValidator instanceof ZodNumber) {
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
      let mappedObject = {};

      // TODO: map multiple form values of the same name
      for (const [key, value] of formData.entries()) {
        const fieldValidator = validator[key];
        if (fieldValidator instanceof z.ZodBoolean) {
          mappedObject[key] = value === "true";
        } else if (fieldValidator instanceof z.ZodNumber) {
          mappedObject[key] = Number(value);
        } else {
          mappedObject[key] = value;
        }
      }
      return mappedObject;
    }, z.object(validator))
    .safeParse(formData);

  return result;
}
