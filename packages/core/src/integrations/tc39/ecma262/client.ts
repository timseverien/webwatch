import axios from 'axios';
import {
	getTokens,
	selectByHeader,
	selectTables,
} from '../../../services/markdown.js';
import {
	Tc39Specification,
	Tc39SpecificationFinished,
	Tc39SpecificationTag,
	Tc39SpecificationUnfinished,
} from '../index.js';
import {
	createSpecificationFromLink,
	getProposalLinksFromTable,
} from '../shared.js';

const SPECIFICATION_TAGS: Tc39SpecificationTag[] = ['ECMA262'];

const client = axios.create({
	baseURL: 'https://raw.githubusercontent.com/tc39/proposals/main',
});

async function getStage0Specifications(): Promise<
	Tc39SpecificationUnfinished[]
> {
	const response = await client.get<string>('/stage-0-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);
	const results: Tc39SpecificationUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(
			await createSpecificationFromLink(link, {
				stage: 0,
				tags: SPECIFICATION_TAGS,
			}),
		);
	}

	return results;
}

async function getStage1Specifications(): Promise<
	Tc39SpecificationUnfinished[]
> {
	const response = await client.get<string>('/stage-1-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);
	const results: Tc39SpecificationUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(
			await createSpecificationFromLink(link, {
				stage: 1,
				tags: SPECIFICATION_TAGS,
			}),
		);
	}

	return results;
}

async function getStage2Specifications(): Promise<
	Tc39SpecificationUnfinished[]
> {
	const response = await client.get<string>('/README.md');
	const content = selectByHeader(getTokens(response.data), 'Stage 2');
	const tables = selectTables(content);
	const results: Tc39SpecificationUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(
			await createSpecificationFromLink(link, {
				stage: 2,
				tags: SPECIFICATION_TAGS,
			}),
		);
	}

	return results;
}

async function getStage3Specifications(): Promise<Tc39Specification[]> {
	const response = await client.get<string>('/README.md');
	const content = selectByHeader(getTokens(response.data), 'Stage 3');
	const tables = selectTables(content);
	const results: Tc39SpecificationUnfinished[] = [];

	for (const link of getProposalLinksFromTable(tables)) {
		results.push(
			await createSpecificationFromLink(link, {
				stage: 3,
				tags: SPECIFICATION_TAGS,
			}),
		);
	}

	return results;
}

async function getStage4Specifications(): Promise<Tc39SpecificationFinished[]> {
	const response = await client.get<string>('/finished-proposals.md');
	const content = getTokens(response.data);
	const tables = selectTables(content);

	return Promise.all(
		getProposalLinksFromTable(tables).map((link) =>
			createSpecificationFromLink(link, {
				stage: 4,
				tags: SPECIFICATION_TAGS,
			}),
		),
	);
}

export async function getSpecifications(): Promise<
	(Tc39SpecificationUnfinished | Tc39SpecificationFinished)[]
> {
	const proposals = await Promise.all([
		getStage0Specifications(),
		getStage1Specifications(),
		getStage2Specifications(),
		getStage3Specifications(),
		getStage4Specifications(),
	]);

	return proposals.flat();
}
