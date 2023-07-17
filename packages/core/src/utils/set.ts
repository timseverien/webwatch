/**
 * See:
 * - https://en.wikipedia.org/wiki/Power_set#Recursive_definition
 * - https://stackoverflow.com/questions/42773836/how-to-find-all-subsets-of-a-set-in-javascript-powerset-of-array
 */
// export function* getPowerSet<T extends any>(
// 	list: T[],
// 	offset: number = 0,
// ): Generator<T[]> {
// 	while (offset < list.length) {
// 		let first = list[offset++];
// 		for (const subset of getPowerSet(list, offset)) {
// 			subset.push(first);
// 			yield subset;
// 		}
// 	}
// 	yield [];
// }

import { getPositiveBitOffsets } from './binary.js';

export function* getPowerSet<T extends any>(list: T[]): Generator<T[]> {
	const listLength = BigInt(list.length);
	const powerSetItemCount = 2n ** listLength;

	for (let i = 0n; i < powerSetItemCount; i++) {
		const indexes = Array.from(
			getPositiveBitOffsets(i.toString(2).padStart(list.length, '0')),
		);

		yield indexes.map((index) => list[index]);
	}
}
