import 'dotenv/config';
import { writeFile } from 'fs/promises';
import { CommandContext } from '../../index.js';
import { spawnAsync } from '../../lib/spawn.js';

export async function generateTypes(context: CommandContext) {
	context.output.announce('Generating database types');
	const types = await spawnAsync(
		'npx',
		[
			'supabase',
			'gen',
			'types',
			'typescript',
			'--project-id',
			process.env.SUPABASE_PROJECT_ID!,
			'--schema',
			'public',
		],
		{
			cwd: context.packages.infrastructure.directory,
		},
	);

	context.output.announce('Writing database types');
	await writeFile(
		context.packages.infrastructure.supabaseDatabaseTypePath,
		types,
	);
}
