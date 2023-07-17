export function* getPositiveBitOffsets(
	binaryString: string,
): Generator<number> {
	for (let index = 0; index < binaryString.length; index++) {
		if (binaryString[binaryString.length - (index + 1)] === '0') continue;
		yield index;
	}
}
