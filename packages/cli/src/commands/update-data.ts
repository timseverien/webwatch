import {
	SPECIFICATION_INTEGRATIONS,
	Specification,
} from '@spectakel/core/src/specification/index.js';
import { CommandContext } from '../index.js';

async function getNewSpecifications() {
	const specifications: Specification[] = [];

	for (const integration of SPECIFICATION_INTEGRATIONS.filter(
		(t) => t.name === 'W3',
	)) {
		const integrationSpecs = await integration.getSpecifications();
		specifications.push(...integrationSpecs);
	}
}

export async function updateData(context: CommandContext) {
	// context.output.announce('Fetching specifications');
	// const client = getClient();
	// const specifications = getSpecification
	// context.output.announce('Fetching specifications');
	// const specificationsNew: Specification[] = await getNewSpecifications();
}
