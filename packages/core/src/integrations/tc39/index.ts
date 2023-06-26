export type TC39ProposalUnfinishedStage = 0 | 1 | 2 | 3;
export type TC39ProposalFinishedStage = 4;
export type TC39ProposalStage =
	| TC39ProposalUnfinishedStage
	| TC39ProposalFinishedStage;

export interface TC39ProposalUnfinished {
	type: 'TC39_PROPOSAL';
	name: string;
	proposalUri: string;
	specificationUri: string | null;
	stage: TC39ProposalUnfinishedStage;
}

export interface TC39ProposalFinished {
	type: 'TC39_PROPOSAL';
	name: string;
	proposalUri: string;
	specificationUri: string;
	stage: TC39ProposalFinishedStage;
}

export type TC39Proposal = TC39ProposalUnfinished | TC39ProposalFinished;
