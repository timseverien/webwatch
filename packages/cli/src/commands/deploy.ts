import { CommandContext } from '../index.js';
import { spawnAsync } from '../lib/spawn.js';

export async function deploy(context: CommandContext) {
	try {
		context.output.announce('Building project');
		await spawnAsync('npm', ['run', 'build'], { cwd: context.directory });
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}
