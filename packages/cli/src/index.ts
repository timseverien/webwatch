#!/usr/bin/env node
// @ts-ignore
import chalk from 'chalk';
import { program } from 'commander';
import * as path from 'node:path';
import { generateMigration } from './commands/database/generate-migration.js';
import { generateTypes } from './commands/database/generate-types.js';
import { deploy } from './commands/deploy.js';
import { develop } from './commands/develop.js';
import { setup } from './commands/setup.js';
import { updateData } from './commands/update-data.js';

function createCommandHandler(
	taskName: string,
	action: (context: CommandContext) => Promise<void>,
) {
	const rootDirectory = path.resolve(__dirname, '../../..');
	const packagesDirectory = path.resolve(rootDirectory, 'packages');
	const cliPackageDirectory = path.resolve(packagesDirectory, 'cli');
	const infrastructurePackageDirectory = path.resolve(
		packagesDirectory,
		'infrastructure',
	);

	const outputPrefix = `${taskName} >`;
	const outputPrefixFormatted = chalk.dim(outputPrefix);

	const context: CommandContext = {
		directory: rootDirectory,

		output: {
			announce: (data) => console.log([outputPrefixFormatted, data].join(' ')),

			instruct: (instruction, detail) => {
				console.log([outputPrefixFormatted, chalk.red(instruction)].join(' '));
				if (detail) {
					console.log(
						[' '.repeat(outputPrefix.length), chalk.dim(detail)].join(' '),
					);
				}
			},
		},

		packages: {
			cli: { directory: cliPackageDirectory },
			infrastructure: {
				directory: infrastructurePackageDirectory,
				supabaseDatabaseTypePath: path.resolve(
					infrastructurePackageDirectory,
					'src/database/.supabase-types.ts',
				),
			},
		},
	};

	return async () => {
		try {
			await action(context);
			context.output.announce('Done');
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	};
}

export type CommandContext = {
	directory: string;

	output: {
		announce: (announcement: string) => void;
		instruct: (instruction: string, detail?: string) => void;
	};

	packages: {
		cli: {
			directory: string;
		};
		infrastructure: {
			directory: string;
			supabaseDatabaseTypePath: string;
		};
	};
};

program.name('@spectakel/cli').description('CLI to manage Spectakel');

program
	.command('db:generate-migration')
	.alias('db:gm')
	.description('Generates migrations')
	.action(createCommandHandler('Generate types', generateMigration));

program
	.command('db:generate-types')
	.alias('db:gt')
	.description('Generates types')
	.action(createCommandHandler('Generate types', generateTypes));

program
	.command('deploy')
	.description('Deploy')
	.action(createCommandHandler('Deploy', deploy));

program
	.command('develop')
	.alias('dev')
	.description('Start every system required for develoment')
	.action(createCommandHandler('Develop', develop));

program
	.command('update-data')
	.alias('du')
	.description('Fetches new data and sends it off to the database')
	.action(createCommandHandler('Update data', updateData));

program
	.command('setup')
	.description('Setup the Spectakel CLI')
	.action(createCommandHandler('Setup', setup));

program.parse(process.argv);
