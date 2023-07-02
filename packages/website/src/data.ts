import type { Tc39Specification } from '@ww/core/src/integrations/tc39';
import {
	W3_SPECIFICATION_TYPES,
	type W3Specification,
} from '@ww/core/src/integrations/w3';

export type Specification = Tc39Specification | W3Specification;

export function isTc39Specification(d: Specification): d is Tc39Specification {
	return d.type === 'TC39_SPECIFICATION';
}

export function isW3Specification(d: Specification): d is W3Specification {
	return (W3_SPECIFICATION_TYPES as readonly string[]).includes(d.type);
}
