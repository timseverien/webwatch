export function createNumberRange(steps: number) {
	return Array.from({ length: steps }, (_, index) => index / (steps - 1));
}
