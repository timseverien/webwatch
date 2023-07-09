import type {
	Specification,
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

export type Tc39SpecificationTag = 'ECMA262' | 'ECMA402';

export type Tc39SpecificationUnfinished = Specification<
	'TC39_SPECIFICATION',
	Tc39SpecificationUnfinishedStage,
	Tc39SpecificationTag
>;

export type Tc39SpecificationFinished = Specification<
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
