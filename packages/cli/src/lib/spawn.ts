import {
	ChildProcess,
	SpawnOptionsWithoutStdio,
	spawn,
} from 'node:child_process';

export function spawnAsync(
	command: string,
	args: string[],
	options: SpawnOptionsWithoutStdio = {},
): Promise<string> {
	const p = spawn(command, args, options);
	return new Promise((resolve, reject) => {
		let stdout = '';
		let stderr = '';

		p.stdout.on('data', (data) => (stdout += data.toString()));
		p.stderr.on('data', (data) => {
			console.error(data.toString());
			stderr += data;
		});

		p.on('close', (code) => {
			if (code === 0) resolve(stdout);
			else reject(stderr);
		});
	});
}

export function spawnIterator(
	command: string,
	args: string[],
	options: SpawnOptionsWithoutStdio = {},
): AsyncIterator<{ stdout: string | null; stderr: string | null }> {
	const p = spawn(command, args, options);

	return {
		next() {
			return new Promise((resolve) => {
				p.stdout.on('data', (data) =>
					resolve({
						value: {
							stderr: null,
							stdout: data.toString(),
						},
					}),
				);

				p.stderr.on('data', (data) =>
					resolve({
						value: {
							stderr: data.toString(),
							stdout: null,
						},
					}),
				);

				p.stderr.on('close', () =>
					resolve({
						done: true,
						value: {
							stderr: null,
							stdout: null,
						},
					}),
				);
			});
		},
	};
}

export function spawnInteractive(
	command: string,
	args: string[],
	options: SpawnOptionsWithoutStdio = {},
): ChildProcess {
	return spawn(command, args, {
		...options,
		stdio: 'inherit',
	});
}
