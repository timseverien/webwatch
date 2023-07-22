import { CommandContext } from '../index.js';
import { spawnAsync } from '../lib/spawn.js';

export default async (context: CommandContext) => {
	try {
		console.log('Preparing CLI');
		await spawnAsync('npm', ['run', 'build'], { cwd: context.rootDirectory });
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};
