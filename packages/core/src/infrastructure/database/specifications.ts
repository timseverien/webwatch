import { Tc39Specification } from '../../integrations/specifications/tc39/index.js';
import {
	Specification,
	SpecificationFilter,
} from '../../specification/index.js';
import { db } from './index.js';

class SpecificationSerializationError extends Error {
	constructor(name: string, public readonly specificationType: string) {
		super(name);
	}
}

type SpecificationSerialized = Omit<Specification, 'lastUpdated'> & {
	lastUpdated: string | null;
};

export function getSpecificationDocument(specificationId: string) {
	return db.specifications.doc(specificationId).get();
}

export async function getSpecifications(filter: SpecificationFilter) {
	const specificationsQuery = await db.specifications
		.withConverter<Specification>({
			fromFirestore: (doc) =>
				deserializeSpecification(doc.data() as SpecificationSerialized),
			toFirestore: serializeSpecification,
		})
		.get();

	return specificationsQuery.docs();

	// return specificationsQuery.docs.map((d) =>
	// 	toDoc<Specification>(d, 'specifications'),
	// );
}

function serializeSpecification(spec: Specification): SpecificationSerialized {
	return {
		...spec,
		lastUpdated: spec.lastUpdated?.toISOString() ?? null,
	};
}

function deserializeSpecification(
	spec: SpecificationSerialized,
): Specification {
	switch (spec.type) {
		case 'TC39_SPECIFICATION':
			return {
				...spec,
				lastUpdated: spec.lastUpdated
					? new Date(Date.parse(spec.lastUpdated))
					: null,
			} as Tc39Specification;
		case 'W3_SPECIFICATION':
			return {
				...spec,
				lastUpdated: spec.lastUpdated
					? new Date(Date.parse(spec.lastUpdated))
					: null,
			} as Tc39Specification;
	}

	throw new Error('SPECIFICATION_SERIALIZATION_UNKNOWN_TYPE');
}
