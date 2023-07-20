import type {
	GenericSpecification,
	SpecificationIntegration,
	SpecificationSerialized,
} from '../index.js';
import { getSpecifications as getEcma262Specifications } from './ecma262/client.js';
import { getSpecifications as getEcma402Specifications } from './ecma402/client.js';

export type Tc39SpecificationUnfinishedStage = 0 | 1 | 2 | 3;
export type Tc39SpecificationFinishedStage = 4;
export type Tc39SpecificationStage =
	| Tc39SpecificationUnfinishedStage
	| Tc39SpecificationFinishedStage;

export const TC39_SPECIFICATION_TAG_LABEL_MAP = {
	ECMA402: 'JavaScript internationalization API',
	ECMA262: 'JavaScript',
};

export type Tc39SpecificationTag =
	keyof typeof TC39_SPECIFICATION_TAG_LABEL_MAP;

export const TC39_SPECIFICATION_TAGS = Object.keys(
	TC39_SPECIFICATION_TAG_LABEL_MAP,
) as Tc39SpecificationTag[];

export type Tc39SpecificationUnfinished = GenericSpecification<
	'TC39_SPECIFICATION',
	Tc39SpecificationUnfinishedStage,
	Tc39SpecificationTag
>;

export type Tc39SpecificationFinished = GenericSpecification<
	'TC39_SPECIFICATION',
	Tc39SpecificationFinishedStage,
	Tc39SpecificationTag
>;

export type Tc39Specification =
	| Tc39SpecificationUnfinished
	| Tc39SpecificationFinished;

export type Tc39SpecificationSerialized =
	SpecificationSerialized<Tc39Specification>;

const deserialize: SpecificationIntegration<Tc39Specification>['deserialize'] =
	(data) =>
		data.map<Tc39Specification>((d) => {
			if (d?.specificationUrl) {
				return {
					...d,
					lastUpdated: d.lastUpdated
						? new Date(Date.parse(d.lastUpdated))
						: null,
				} as Tc39SpecificationUnfinished;
			}

			return {
				...d,
				lastUpdated: d.lastUpdated ? new Date(Date.parse(d.lastUpdated)) : null,
			} as Tc39SpecificationFinished;
		});

const serialize: SpecificationIntegration<Tc39Specification>['serialize'] = (
	data,
) =>
	data.map<Tc39SpecificationSerialized>((d) => ({
		...d,
		lastUpdated: d.lastUpdated ? d.lastUpdated.toISOString() : null,
	}));

export const ECMA262_INTEGRATION: SpecificationIntegration<Tc39Specification> =
	{
		getSpecifications: getEcma262Specifications,
		serialize,
		deserialize,
	};

export const ECMA402_INTEGRATION: SpecificationIntegration<Tc39Specification> =
	{
		getSpecifications: getEcma402Specifications,
		serialize,
		deserialize,
	};
