import { type SafeParseReturnType, type ZodRawShape } from "zod";
import {
  type FormState,
  validateForm,
  formValidatorToState,
} from "simple-stack-form/client";
import { createContext, useContext, type ComponentProps } from "react";
import { useStore } from "@nanostores/react";
import { type MapStore, map } from "nanostores";

const FormContext = createContext<MapStore<FormState>>(map());

export function Form({
  children,
  validator,
  ...formProps
}: {
  children: React.ReactNode;
  validator: ZodRawShape;
} & Omit<ComponentProps<"form">, "method" | "onSubmit">) {
  const formStore = map(formValidatorToState(validator));

  return (
    <FormContext.Provider value={formStore}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const parsed = validateForm(formData, validator);
          if (parsed.success === true) return;

          e.stopPropagation();
          for (const error of parsed.error.errors) {
            formStore.setKey(error.path.join("."), {
              hasErrored: true,
              validationErrors: [error.message],
              // TODO: support nested paths
              validator: validator[error.path[0]],
            });
          }
        }}
        {...formProps}
        method="POST"
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

export function Input(inputProps: ComponentProps<"input"> & { name: string }) {
  const store = useContext(FormContext);
  const $formState = useStore(store);
  const inputState = $formState[inputProps.name];
  if (!inputState) {
    throw new Error(
      `Input "${inputProps.name}" not found in form. Did you use the <Form> component with your validator?`
    );
  }

  const { hasErrored, validationErrors, validator } = inputState;

  function setValidation(parsed: SafeParseReturnType<unknown, unknown>) {
    if (parsed.success === false) {
      return store.setKey(inputProps.name, {
        hasErrored: true,
        validationErrors: parsed.error.errors.map((e) => e.message),
        validator,
      });
    }
    store.setKey(inputProps.name, {
      validationErrors: [],
      hasErrored,
      validator,
    });
  }

  return (
    <>
      <input
        {...inputProps}
        onBlur={(e) => {
          if (e.target.value === "") return;
          setValidation(validator.safeParse(e.target.value));
        }}
        onChange={(e) => {
          if (!hasErrored) return;
          setValidation(validator.safeParse(e.target.value));
        }}
      />
      {validationErrors.map((e) => (
        <p className="text-red-400" key={e}>
          {e}
        </p>
      ))}
    </>
  );
}
