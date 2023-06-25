export interface ProposalUnfinished<StageType extends any> {
	type: 'PROPOSAL_UNFINISHED';
	name: string;
	proposalUri: string;
	specificationUri: string | null;
	stage: StageType;
}

export interface ProposalFinished<StageType extends any> {
	type: 'PROPOSAL_FINISHED';
	name: string;
	proposalUri: string;
	specificationUri: string;
	stage: StageType;
}

export type Proposal<T> = ProposalUnfinished<T> | ProposalFinished<T>;
