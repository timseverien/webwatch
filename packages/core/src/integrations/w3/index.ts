// https://www.w3.org/2005/10/Process-20051014/tr#maturity-levels
export type W3SpecificationLevel = 'WD' | 'CR' | 'PR' | 'REC';

export interface W3Specification {
	type: 'CSS_SPECIFICATION';
	name: string;
	specificationUrl: string;
	level: W3SpecificationLevel;
}
