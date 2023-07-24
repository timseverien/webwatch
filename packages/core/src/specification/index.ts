import {
	ECMA262_INTEGRATION,
	ECMA402_INTEGRATION,
	Tc39Specification,
} from '../integrations/specifications/tc39/index.js';
import {
	W3Specification,
	W3_INTEGRATION,
} from '../integrations/specifications/w3/index.js';
import type { LinkAboutSpecification } from '../link/index.js';

export type GenericSpecification<
	TypeType extends string = string,
	MaturityType extends number | string = any,
	TagType extends string = string,
> = {
	type: TypeType;
	name: string;
	specificationUrl: string;
	lastUpdated: Date | null;
	maturity: MaturityType;
	tags: TagType[];
	links: LinkAboutSpecification[];
};

export type Specification = W3Specification | Tc39Specification;
export type SpecificationMaturity = Specification['maturity'];
export type SpecificationTag = Specification['tags'][number];

export type SpecificationSerialized<T extends Specification> = Omit<
	T,
	'lastUpdated'
> & {
	lastUpdated: string | null;
};

export interface SpecificationIntegration<
	T extends Specification = Specification,
> {
	name: string;
	getSpecifications(): Promise<T[]>;
	deserialize(data: SpecificationSerialized<T>[]): T[];
	serialize(data: T[]): SpecificationSerialized<T>[];
}

export type SpecificationFilter = {
	lastUpdatedMin: Date | null;
	name: string | null;
	stages: SpecificationMaturity[];
	tags: SpecificationTag[];
};

export const SPECIFICATION_INTEGRATIONS = [
	ECMA262_INTEGRATION,
	ECMA402_INTEGRATION,
	W3_INTEGRATION,
];
