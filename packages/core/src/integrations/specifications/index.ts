import type { LinkAboutSpecification } from '../links/index.js';
import { Tc39Specification } from './tc39/index.js';
import { W3Specification } from './w3/index.js';

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

export type SpecificationSerialized<T extends Specification> = Omit<
	T,
	'lastUpdated'
> & {
	lastUpdated: string | null;
};

export interface SpecificationIntegration<
	T extends Specification = Specification,
> {
	getSpecifications(): Promise<T[]>;
	deserialize(data: SpecificationSerialized<T>[]): T[];
	serialize(data: T[]): SpecificationSerialized<T>[];
}
