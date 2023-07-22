import { SpawnOptionsWithoutStdio, spawn } from 'node:child_process';

export async function spawnAsync(
	command: string,
	args: string[],
	options: SpawnOptionsWithoutStdio = {},
) {
	const p = spawn(command, args, options);
	return new Promise((resolve, reject) => {
		let stdout = '';
		let stderr = '';

		p.stdout.on('data', (data) => (stdout += data));
		p.stderr.on('data', (data) => (stderr += data));

		p.on('close', (code) => {
			if (code === 0) resolve(stdout);
			else reject(stderr);
		});
	});
}
