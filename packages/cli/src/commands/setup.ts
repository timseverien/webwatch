import { CommandContext } from '../index.js';

export async function setup(context: CommandContext) {
	context.output.instruct(
		'Add an alias to your .profile file:',
		`alias spectakel="${context.directory}/node_modules/.bin/vite-node ${context.directory}/dist/cli.cjs"`,
	);
}
