export function sleep(delay: number) {
	return new Promise<void>((resolve) => {
		setTimeout(() => resolve(), delay);
	});
}

export async function timeTask(task: () => Promise<void>) {
	const start = new Date();
	await task();
	const end = new Date();

	return {
		start,
		end,
		duration: end.getTime() / 1000 - start.getTime() / 1000,
	};
}
