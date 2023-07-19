import {
	ECMA262_INTEGRATION,
	ECMA402_INTEGRATION,
	TC39_SPECIFICATION_TAG_LABEL_MAP,
	Tc39SpecificationSerialized,
	type Tc39Specification,
	type Tc39SpecificationTag,
} from '@ww/core/src/integrations/tc39';
import {
	W3SpecificationSerialized,
	W3_INTEGRATION,
	W3_SPECIFICATION_TAG_LABEL_MAP,
	type W3Specification,
	type W3SpecificationTag,
} from '@ww/core/src/integrations/w3';
import specificationsEcma262Data from '@ww/data/ecma262.json';
import specificationsEcma402Data from '@ww/data/ecma402.json';
import specificationsW3Data from '@ww/data/w3.json';
import crypto from 'node:crypto';

export type Specification = Tc39Specification | W3Specification;
export type SpecificationTag = Tc39SpecificationTag | W3SpecificationTag;

export type SpecificationWithId<T extends Specification = Specification> = T & {
	id: string;
};

export const SPECIFICATION_TAG_LABEL_MAP: {
	[tag in SpecificationTag]: string;
} = {
	...W3_SPECIFICATION_TAG_LABEL_MAP,
	...TC39_SPECIFICATION_TAG_LABEL_MAP,
};

export const SPECIFICATION_TAGS = Object.keys(
	SPECIFICATION_TAG_LABEL_MAP,
) as SpecificationTag[];

const SPECIFICATION_STAGES = ['UPCOMING', 'COMPLETED'] as const;
export type SpecificationStage = (typeof SPECIFICATION_STAGES)[number];

export const SPECIFICATION_STAGE_LABEL_MAP: {
	[stage in SpecificationStage]: string;
} = {
	COMPLETED: 'Completed',
	UPCOMING: 'Upcoming',
};

export async function getSpecifications(): Promise<
	SpecificationWithId<Specification>[]
> {
	return Promise.all(
		[
			...ECMA262_INTEGRATION.deserialize(
				specificationsEcma262Data as Tc39SpecificationSerialized[],
			),
			...ECMA402_INTEGRATION.deserialize(
				specificationsEcma402Data as Tc39SpecificationSerialized[],
			),
			...W3_INTEGRATION.deserialize(
				specificationsW3Data as W3SpecificationSerialized[],
			),
		].map<Promise<SpecificationWithId>>(async (spec) => ({
			id: await getSpecificationId(spec),
			...spec,
		})),
	);
}

export async function getSpecificationTags(): Promise<SpecificationTag[]> {
	const specifications = await getSpecifications();
	const tags: SpecificationTag[] = [];

	for (const spec of specifications) {
		for (const tag of spec.tags) {
			tags.push(tag);
		}
	}

	return tags;
}

function getSpecificationStageFromTc39Specification(
	spec: Tc39Specification,
): SpecificationStage {
	if (spec.maturity === 4) return 'COMPLETED';
	return 'UPCOMING';
}

function getSpecificationStageFromW3Specification(
	spec: W3Specification,
): SpecificationStage {
	if (spec.maturity === 'REC') return 'COMPLETED';
	return 'UPCOMING';
}

export function getSpecificationStage(spec: Specification): SpecificationStage {
	switch (spec.type) {
		case 'TC39_SPECIFICATION':
			return getSpecificationStageFromTc39Specification(spec);
		case 'W3_SPECIFICATION':
			return getSpecificationStageFromW3Specification(spec);
		default:
			throw new Error('Unknown specification type');
	}
}

export async function getSpecificationId(spec: Specification): Promise<string> {
	const encoder = new TextEncoder();

	const result = await crypto.webcrypto.subtle.digest(
		'SHA-1',
		encoder.encode(spec.specificationUrl),
	);

	return Array.from(new Uint8Array(result))
		.map((n) => n.toString(16))
		.join('');
}

export function getSpecificationPath(spec: SpecificationWithId): string {
	return `/specification/${spec.id}`;
}
