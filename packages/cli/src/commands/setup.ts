import { CommandContext } from '../index.js';
import { spawnAsync } from '../lib/spawn.js';

export default async (context: CommandContext) => {
	console.log('Preparing CLI');
	await spawnAsync('npm', ['run', 'build'], { cwd: context.rootDirectory });

	console.log('\nAdd an alias to your .profile file:');
	console.log(`> alias spectakel="node ${context.rootDirectory}/dist/cli.cjs"`);
};
