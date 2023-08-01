#!/usr/bin/env node
// @ts-ignore
import {
	DatabaseClient,
	createClient,
} from '@spectakel/infrastructure/src/database/index.js';
import chalk from 'chalk';
import { program } from 'commander';
import * as path from 'node:path';
import { migrate } from './commands/database/migrate.js';
import { deploy } from './commands/deploy.js';
import { develop } from './commands/develop.js';
import { setup } from './commands/setup.js';
import { updateData } from './commands/update-data.js';
import { generateDatabaseTypes } from './lib/infrastructure.js';

const databaseClient = createClient();

function createCommandHandler<
	T extends (context: CommandContext, args: any) => Promise<void>,
>(taskName: string, action: T): (args: any) => Promise<void> {
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

		databaseClient: databaseClient,

		output: {
			announce: (data) => console.log([outputPrefixFormatted, data].join(' ')),

			announceError: (data) =>
				console.error([outputPrefixFormatted, data].join(' ')),

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

	return async (args) => {
		try {
			await action(context, args);
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
		announceError: (announcement: string) => void;
		instruct: (instruction: string, detail?: string) => void;
	};

	databaseClient: DatabaseClient;

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

program.name('spectakel').description('CLI to manage Spectakel');

program
	.command('db:generate-types')
	.alias('db:gt')
	.description('Generate types from schema')
	.action(
		createCommandHandler('Database - generate types', generateDatabaseTypes),
	);

program
	.command('db:migrate')
	.alias('db:m')
	.description('Run migrations in development environment')
	.action(createCommandHandler('Database - run migrations', migrate));

program
	.command('deploy')
	.description('Deploy')
	.action(createCommandHandler('Deploy', deploy));

program
	.command('develop')
	.alias('dev')
	.description('Start every system required for development')
	.action(createCommandHandler('Develop', develop));

program
	.command('data:update')
	.alias('d:u')
	.option('-f, --force', 'Force update so no specification is skipped', false)
	.description('Fetches new data and sends it off to the database')
	.action(createCommandHandler('Update data', updateData));

program
	.command('setup')
	.description('Setup the Spectakel CLI')
	.action(createCommandHandler('Setup', setup));

program.parse(process.argv);
