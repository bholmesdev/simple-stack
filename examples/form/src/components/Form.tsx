import { type SafeParseReturnType, type ZodRawShape } from "zod";
import { createFormStore, validateForm } from "../create-form";
import { createContext, useContext } from "react";
import { useStore } from "@nanostores/react";

const FormContext = createContext(createFormStore({}));

export function Form({
  children,
  validator,
}: {
  children: React.ReactNode;
  validator: ZodRawShape;
}) {
  const formStore = createFormStore(validator);

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
        method="POST"
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

export function Input({ ...inputProps }: { name: string }) {
  const store = useContext(FormContext);
  const $formState = useStore(store);
  const { hasErrored, validationErrors, validator } =
    $formState[inputProps.name];

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
          setValidation(validator.safeParse(e.target.value));
        }}
        onChange={(e) => {
          if (!hasErrored) return;
          setValidation(validator.safeParse(e.target.value));
        }}
      />
      {validationErrors.map((e) => (
        <p key={e}>{e}</p>
      ))}
    </>
  );
}
