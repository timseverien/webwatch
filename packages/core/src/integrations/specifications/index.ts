import type { Link } from '../links/index.js';

export type Specification<
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
	links: Link[];
};

export type SpecificationSerialized<T extends Specification> = Omit<
	T,
	'lastUpdated'
> & {
	lastUpdated: string | null;
};

export interface SpecificationIntegration<T extends Specification> {
	getSpecifications(): Promise<T[]>;
	deserialize(data: SpecificationSerialized<T>[]): T[];
	serialize(data: T[]): SpecificationSerialized<T>[];
}
