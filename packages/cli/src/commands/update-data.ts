import { INTEGRATION_W3 } from '@spectakel/core/src/integrations/w3.js';
import { isEqual } from '@spectakel/core/src/specification/index.js';
import type { SpecificationSourceIntegration } from '@spectakel/core/src/specification/source.js';
import {
	getPublisherByKey,
	getPublishers,
	getSpecificationsByPublisher,
	storeNewPublisher,
	storeNewSpecification,
} from '@spectakel/infrastructure/src/database/specification.js';
import type { CommandContext } from '../index.js';
import { generateDatabaseTypes } from '../lib/infrastructure.js';

const specificationSourceIntegrations: SpecificationSourceIntegration[] = [
	INTEGRATION_W3,
];

async function addMissingPublishers(context: CommandContext) {
	const publishers = await getPublishers(context.databaseClient);
	const missingPublishers = specificationSourceIntegrations
		.map((s) => s.publisherInfo)
		.filter((p) => !publishers.some((kp) => kp.key === p.key));

	for (const publisher of missingPublishers) {
		context.output.announce(`Adding ${publisher.name}`);
		await storeNewPublisher(context.databaseClient, publisher);
	}
}

async function updateSpecifications(context: CommandContext) {
	const publisher = await getPublisherByKey(context.databaseClient, 'W3');
	const specifications = await getSpecificationsByPublisher(
		context.databaseClient,
		publisher.id,
	);

	for await (const spec of INTEGRATION_W3.getSpecifications()) {
		const specification = specifications.find((s) => s.url === spec.url);

		if (!specification) {
			context.output.announce(`- Storing ${spec.name} to the database`);
			await storeNewSpecification(context.databaseClient, spec);
			continue;
		}

		if (!isEqual(spec, specification)) {
			context.output.announce(`- Updating ${spec.name}`);
			continue;
		}

		context.output.announce(
			`${spec.name} is already in the database, but might need update`,
		);
	}
}

export async function updateData(context: CommandContext) {
	context.output.announce('Generating types from schema');
	await generateDatabaseTypes(context);

	context.output.announce('Adding new publishers to database');
	await addMissingPublishers(context);

	context.output.announce('Fetching specifications');
	await updateSpecifications(context);
}
