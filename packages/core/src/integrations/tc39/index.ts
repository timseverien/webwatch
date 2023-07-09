export type Tc39SpecificationUnfinishedStage = 0 | 1 | 2 | 3;
export type Tc39SpecificationFinishedStage = 4;
export type Tc39SpecificationStage =
	| Tc39SpecificationUnfinishedStage
	| Tc39SpecificationFinishedStage;

export type Tc39SpecificationTag = 'ECMA262' | 'ECMA402';

export interface Tc39SpecificationUnfinished {
	type: 'TC39_SPECIFICATION';
	name: string;
	proposalUrl: string;
	specificationUrl: string | null;
	stage: Tc39SpecificationUnfinishedStage;
	lastUpdated: Date | null;
	tags: Tc39SpecificationTag[];
}

export interface Tc39SpecificationFinished {
	type: 'TC39_SPECIFICATION';
	name: string;
	proposalUrl: string;
	specificationUrl: string;
	stage: Tc39SpecificationFinishedStage;
	lastUpdated: Date;
	tags: Tc39SpecificationTag[];
}

export type Tc39Specification =
	| Tc39SpecificationUnfinished
	| Tc39SpecificationFinished;

export interface Tc39SpecificationSerialized
	extends Omit<Tc39Specification, 'lastUpdated'> {
	lastUpdated: string | null;
}

export function serialize(
	data: Tc39Specification[],
): Tc39SpecificationSerialized[] {
	return data.map<Tc39SpecificationSerialized>((d) => ({
		...d,
		lastUpdated: d.lastUpdated ? d.lastUpdated.toISOString() : null,
	}));
}

export function deserialize(
	data: Tc39SpecificationSerialized[],
): Tc39Specification[] {
	return data.map<Tc39Specification>((d) => {
		if (d?.specificationUrl) {
			return {
				...d,
				lastUpdated: d.lastUpdated ? new Date(Date.parse(d.lastUpdated)) : null,
			} as Tc39SpecificationUnfinished;
		}

		return {
			...d,
			lastUpdated: d.lastUpdated ? new Date(Date.parse(d.lastUpdated)) : null,
		} as Tc39SpecificationFinished;
	});
}
