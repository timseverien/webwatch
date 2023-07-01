import type { Tc39Proposal } from '@ww/core/src/integrations/tc39';
import {
	W3_SPECIFICATION_TYPES,
	type W3Specification,
} from '@ww/core/src/integrations/w3';

export type ProposalOrSpecification = Tc39Proposal | W3Specification;

export function isTc39Proposal(d: ProposalOrSpecification): d is Tc39Proposal {
	return d.type === 'TC39_PROPOSAL';
}

export function isW3Specification(
	d: ProposalOrSpecification,
): d is W3Specification {
	return (W3_SPECIFICATION_TYPES as readonly string[]).includes(d.type);
}
