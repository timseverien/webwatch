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
	lastUpdated: Date | null;
}

export interface Tc39ProposalFinished {
	type: 'TC39_PROPOSAL';
	name: string;
	proposalUri: string;
	specificationUri: string;
	stage: Tc39ProposalFinishedStage;
	lastUpdated: Date | null;
}

export type Tc39Proposal = Tc39ProposalUnfinished | Tc39ProposalFinished;

export interface Tc39ProposalSerialized
	extends Omit<Tc39Proposal, 'lastUpdated'> {
	lastUpdated: string | null;
}

export function serialize(data: Tc39Proposal[]): Tc39ProposalSerialized[] {
	return data.map<Tc39ProposalSerialized>((d) => ({
		...d,
		lastUpdated: d.lastUpdated ? d.lastUpdated.toISOString() : null,
	}));
}

export function deserialize(data: Tc39ProposalSerialized[]): Tc39Proposal[] {
	return data.map<Tc39Proposal>((d) => {
		if (d?.specificationUri) {
			return {
				...d,
				lastUpdated: d.lastUpdated ? new Date(Date.parse(d.lastUpdated)) : null,
			} as Tc39ProposalUnfinished;
		}

		return {
			...d,
			lastUpdated: d.lastUpdated ? new Date(Date.parse(d.lastUpdated)) : null,
		} as Tc39ProposalFinished;
	});
}
