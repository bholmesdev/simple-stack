import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
	cancel,
	confirm,
	intro,
	isCancel,
	note,
	outro,
	text,
} from "@clack/prompts";
import { bgGreen, bgWhite, black, bold, cyan, dim, green } from "kleur/colors";

const cmd = process.argv[2];

switch (cmd) {
	case "create":
		await create();
		break;
	default:
		help();
		break;
}

async function create() {
	intro(`Create a new form component`);
	// Do stuff
	const useReact = handleCancel(
		await confirm({
			message: "Do you want to use React?",
			initialValue: true,
		}),
	);

	if (!useReact) {
		note("Well, sorry. We only support React right now ;)");
	}

	const relativeOutputDir = handleCancel(
		await text({
			message: "What directory should we use?",
			initialValue: "src/components",
			validate: (value) => {
				if (!value) {
					return "Please enter a path.";
				}
				if (existsSync(resolve(process.cwd(), value, "Form.tsx"))) {
					return "A Form.tsx component already exists here.";
				}
			},
		}),
	);

	if (!existsSync(resolve(process.cwd(), relativeOutputDir))) {
		await mkdir(resolve(process.cwd(), relativeOutputDir), {
			recursive: true,
		});
	}

	const relativeOutputPath = join(relativeOutputDir, "Form.tsx");
	const outputPath = resolve(process.cwd(), relativeOutputPath);

	const reactFormTemplate = await readFile(
		new URL("../templates/react/Form.tsx", import.meta.url),
	);

	await writeFile(outputPath, reactFormTemplate);

	outro(`${bold(cyan(relativeOutputPath))} created. You're all set!`);
}

function help() {
	printHelp({
		commandName: "simple-form",
		usage: "[command] [...flags]",
		headline: "Handle forms in Astro projects, simply.",
		tables: {
			Commands: [["create", "Create a new form component."]],
			"Global Flags": [["--help", "Show this help message."]],
		},
	});
}

function handleCancel<T>(result: T): Exclude<T, symbol> {
	if (isCancel(result)) {
		cancel(`Cancelled.`);
		process.exit(0);
	}
	// TODO: Figure out type narrowing
	return result as unknown as Exclude<T, symbol>;
}

/**
 * Format help two-column grid.
 * @see https://github.com/withastro/astro/blob/main/packages/astro/src/core/messages.ts#L298
 */
function printHelp({
	commandName,
	headline,
	usage,
	tables,
	description,
}: {
	commandName: string;
	headline?: string;
	usage?: string;
	tables?: Record<string, [command: string, help: string][]>;
	description?: string;
}) {
	const linebreak = () => "";
	const title = (label: string) => `  ${bgWhite(black(` ${label} `))}`;
	const table = (
		rows: [string, string][],
		{ padding }: { padding: number },
	) => {
		const split = process.stdout.columns < 60;
		let raw = "";

		for (const row of rows) {
			if (split) {
				raw += `    ${row[0]}\n    `;
			} else {
				raw += `${`${row[0]}`.padStart(padding)}`;
			}
			raw += "  " + dim(row[1]) + "\n";
		}

		return raw.slice(0, -1); // remove latest \n
	};

	let message = [];

	if (headline) {
		message.push(
			linebreak(),
			`  ${bgGreen(black(` ${commandName} `))} ${green(
				`v${process.env.PACKAGE_VERSION ?? ""}`,
			)} ${headline}`,
		);
	}

	if (usage) {
		message.push(linebreak(), `  ${green(commandName)} ${bold(usage)}`);
	}

	if (tables) {
		function calculateTablePadding(rows: [string, string][]) {
			return rows.reduce((val, [first]) => Math.max(val, first.length), 0) + 2;
		}
		const tableEntries = Object.entries(tables);
		const padding = Math.max(
			...tableEntries.map(([, rows]) => calculateTablePadding(rows)),
		);
		for (const [tableTitle, tableRows] of tableEntries) {
			message.push(
				linebreak(),
				title(tableTitle),
				table(tableRows, { padding }),
			);
		}
	}

	if (description) {
		message.push(linebreak(), `${description}`);
	}

	// eslint-disable-next-line no-console
	console.info(message.join("\n") + "\n");
}
