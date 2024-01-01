import { existsSync } from "node:fs";
import { mkdir, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
	cancel,
	confirm,
	intro,
	isCancel,
	outro,
	select,
	text,
} from "@clack/prompts";
import { copy } from "fs-extra/esm";
import { bgGreen, bgWhite, black, bold, dim, green } from "kleur/colors";

const frameworks = [
	{
		value: "react",
		label: "React",
		templateDir: "react",
	},
	{
		value: "preact",
		label: "Preact",
		templateDir: "preact",
	},
] as const;

type Framework = (typeof frameworks)[number];

const internalFiles = ["env.d.ts", "tsconfig.json"];

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
	let foundFramework: Framework | null = null;
	const packageJsonPath = resolve(process.cwd(), "package.json");
	if (existsSync(packageJsonPath)) {
		const { dependencies = {}, devDependencies = {} } = JSON.parse(
			await readFile(packageJsonPath, { encoding: "utf-8" }),
		);

		for (const framework of frameworks) {
			if (
				Object.keys(dependencies).includes(framework.value) ||
				Object.keys(devDependencies).includes(framework.value)
			) {
				foundFramework = framework;
				break;
			}
		}
	}

	const useFoundFramework =
		!!foundFramework &&
		handleCancel(
			await confirm({
				message: `Do you want to use ${foundFramework.label}?`,
				initialValue: true,
			}),
		);

	const toUseFramework = await (async () => {
		if (useFoundFramework) {
			return foundFramework!;
		}

		const selected = (await select({
			message: "What framework should we use?",
			options: frameworks.map(({ value, label }) => ({
				value: value,
				label: label,
			})),
		})) as Framework["value"];

		return frameworks.find((framework) => framework.value === selected)!;
	})();

	const fileNamesToCreate = (
		await readdir(
			new URL(`../templates/${toUseFramework.templateDir}`, import.meta.url),
		)
	).filter((fileName) => !internalFiles.includes(fileName));

	const relativeOutputDir = handleCancel(
		await text({
			message: "What directory should we use?",
			initialValue: "src/components",
			validate: (value) => {
				if (!value) {
					return "Please enter a path.";
				}
				const conflict = fileNamesToCreate.find((fileName) =>
					existsSync(resolve(process.cwd(), value, fileName)),
				);
				if (conflict) {
					return `${bold(
						conflict,
					)} already exists here. Choose a different directory.`;
				}
			},
		}),
	);

	if (!existsSync(resolve(process.cwd(), relativeOutputDir))) {
		await mkdir(resolve(process.cwd(), relativeOutputDir), {
			recursive: true,
		});
	}

	const outputPath = resolve(process.cwd(), relativeOutputDir);

	const templatePath = fileURLToPath(
		new URL(`../templates/${toUseFramework.templateDir}`, import.meta.url),
	);

	await copy(templatePath, outputPath, {
		filter: (src) => {
			const fileName = src.split("/").at(-1);
			return !!fileName && !internalFiles.includes(fileName);
		},
	});

	outro(`Form created. You're all set!`);
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
