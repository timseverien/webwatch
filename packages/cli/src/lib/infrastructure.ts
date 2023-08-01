import { CommandContext } from '../index.js';
import { spawnAsync } from './spawn.js';

export async function deployDatabaseMigration(context: CommandContext) {
	await spawnAsync('npx', ['prisma', 'migrate', 'deploy'], {
		cwd: context.packages.infrastructure.directory,
	});
}

export async function generateDatabaseMigration(
	context: CommandContext,
	name: string,
) {
	await spawnAsync('npx', ['prisma', 'migrate', 'dev', '--name', name], {
		cwd: context.packages.infrastructure.directory,
	});
}

export async function generateDatabaseTypes(context: CommandContext) {
	await spawnAsync('npx', ['prisma', 'generate'], {
		cwd: context.packages.infrastructure.directory,
	});
}
