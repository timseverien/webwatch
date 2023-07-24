import type { DatabaseClient } from '@spectakel/infrastructure/src/database';

export function getSpecifications(client: DatabaseClient) {
	client.from;
}

// class SpecificationSerializationError extends Error {
// 	constructor(name: string, public readonly specificationType: string) {
// 		super(name);
// 	}
// }

// type SpecificationSerialized = Omit<Specification, 'lastUpdated'> & {
// 	lastUpdated: string | null;
// };

// export async function getSpecifications(filter: SpecificationFilter) {
// 	return (await client.from('specifications').select()).data;
// }

// function serializeSpecification(spec: Specification): SpecificationSerialized {
// 	return {
// 		...spec,
// 		lastUpdated: spec.lastUpdated?.toISOString() ?? null,
// 	};
// }

// function deserializeSpecification(
// 	spec: SpecificationSerialized,
// ): Specification {
// 	switch (spec.type) {
// 		case 'TC39_SPECIFICATION':
// 			return {
// 				...spec,
// 				lastUpdated: spec.lastUpdated
// 					? new Date(Date.parse(spec.lastUpdated))
// 					: null,
// 			} as Tc39Specification;
// 		case 'W3_SPECIFICATION':
// 			return {
// 				...spec,
// 				lastUpdated: spec.lastUpdated
// 					? new Date(Date.parse(spec.lastUpdated))
// 					: null,
// 			} as Tc39Specification;
// 	}

// 	throw new Error('SPECIFICATION_SERIALIZATION_UNKNOWN_TYPE');
// }
