import { createForm } from "simple-stack-form/module";
import { z } from "zod";
import Signup from "./Signup";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const signup = createForm({
	username: z
		.string()
		.min(2)
		.refine(async (s) => {
			await sleep(400);
			return s !== "admin";
		}),
	optIn: z.boolean().optional(),
});

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
				<Signup />
			</div>
		</main>
	);
}
