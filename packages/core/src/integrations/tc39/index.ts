import { ProposalFinished, ProposalUnfinished } from '../shared.js';

export type TC39ProposalUnfinishedStage = 0 | 1 | 2 | 3;
export type TC39ProposalFinishedStage = 4;
export type TC39ProposalStage =
	| TC39ProposalUnfinishedStage
	| TC39ProposalFinishedStage;

export type TC39ProposalUnfinished =
	ProposalUnfinished<TC39ProposalUnfinishedStage>;
export type TC39ProposalFinished = ProposalFinished<TC39ProposalFinishedStage>;
export type TC39Proposal = TC39ProposalUnfinished | TC39ProposalFinished;
