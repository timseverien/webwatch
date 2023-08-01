import { spawn } from 'node:child_process';
import { CommandContext } from '../index.js';
import { generateDatabaseTypes } from '../lib/infrastructure.js';
import { spawnAsync } from '../lib/spawn.js';

export async function develop(context: CommandContext) {
	context.output.announce('Generating types from schema');
	await generateDatabaseTypes(context);

	context.output.announce('Starting infrastructure systems');
	await spawnAsync(
		'npm',
		['run', 'start', '--workspace', '@spectakel/infrastructure'],
		{ cwd: context.directory },
	);

	context.output.announce('Starting website');
	const p = spawn('npm', ['run', 'dev', '--workspace', '@spectakel/website'], {
		cwd: context.directory,
	});
	p.stdout.pipe(process.stdout);
	p.stderr.pipe(process.stderr);
}
