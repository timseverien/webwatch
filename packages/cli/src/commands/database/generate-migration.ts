import { CommandContext } from '../../index.js';
import { spawnAsync } from '../../lib/spawn.js';

export async function generateMigration(context: CommandContext) {
	context.output.announce('Generating database migration');
	await spawnAsync('npx', ['supabase', 'db', 'diff'], {
		cwd: context.packages.infrastructure.directory,
	});
}
