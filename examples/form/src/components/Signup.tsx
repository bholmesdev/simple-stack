import { z } from "zod";
import { createForm } from "../create-form";
import { Form, Input } from "./Form";

export const signup = await createForm({
  name: z.string(),
  optIn: z.boolean().optional(),
});

export default function Signup() {
  return (
    <Form validator={signup.validator}>
      <label htmlFor="name">Name</label>
      <Input id="name" {...signup.inputProps.name} />
      <Input {...signup.inputProps.optIn} />
      <button>Submit</button>
    </Form>
  );
}
