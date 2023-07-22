#!/usr/bin/env node
// @ts-ignore
import { program } from 'commander';
import * as path from 'node:path';
import deploy from './commands/deploy.js';
import setup from './commands/setup.js';

function createCommandHandler(
	action: (context: CommandContext) => Promise<void>,
) {
	const context: CommandContext = {
		rootDirectory: path.resolve(__dirname, '..'),
	};

	return async () => {
		try {
			await action(context);
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	};
}

export type CommandContext = {
	rootDirectory: string;
};

program.name('@spectakel/cli').description('CLI to manage Spectakel');

program
	.command('deploy')
	.description('Deploy')
	.action(createCommandHandler(deploy));

program
	.command('setup')
	.description('Setup the Spectakel CLI')
	.action(createCommandHandler(setup));

program.parse(process.argv);
