export type Tc39ProposalUnfinishedStage = 0 | 1 | 2 | 3;
export type Tc39ProposalFinishedStage = 4;
export type Tc39ProposalStage =
	| Tc39ProposalUnfinishedStage
	| Tc39ProposalFinishedStage;

export interface Tc39ProposalUnfinished {
	type: 'TC39_PROPOSAL';
	name: string;
	proposalUri: string;
	specificationUri: string | null;
	stage: Tc39ProposalUnfinishedStage;
}

export interface Tc39ProposalFinished {
	type: 'TC39_PROPOSAL';
	name: string;
	proposalUri: string;
	specificationUri: string;
	stage: Tc39ProposalFinishedStage;
}

export type Tc39Proposal = Tc39ProposalUnfinished | Tc39ProposalFinished;
