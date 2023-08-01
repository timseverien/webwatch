import { CommandContext } from '../../index.js';
import { spawnInteractive } from '../../lib/spawn.js';

export async function migrate(context: CommandContext) {
	context.output.announce('Running migrations on dev database');

	spawnInteractive('npx', ['prisma', 'migrate', 'dev'], {
		cwd: context.packages.infrastructure.directory,
	});
}
