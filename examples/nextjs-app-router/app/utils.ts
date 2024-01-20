import { validateForm } from "simple-stack-form/module";
import { useFormState as useForStateBase } from "react-dom";

type ValidateFormResult = Awaited<ReturnType<typeof validateForm>> | null;
export function useFormState(
	action: (formData: FormData) => Promise<ValidateFormResult>,
) {
	return useForStateBase(
		async (_: ValidateFormResult, formData: FormData) => action(formData),
		null,
	);
}
