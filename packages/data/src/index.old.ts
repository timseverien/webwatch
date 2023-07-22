import {
	LINK_INTEGRATIONS,
	LinkAboutSpecification,
} from '@spectakel/core/src/integrations/links/index.js';
import {
	Specification,
	SpecificationIntegration,
} from '@spectakel/core/src/integrations/specifications/index.js';
import {
	ECMA262_INTEGRATION,
	ECMA402_INTEGRATION,
} from '@spectakel/core/src/integrations/specifications/tc39';
import { W3_INTEGRATION } from '@spectakel/core/src/integrations/specifications/w3/index.js';
import * as fs from 'node:fs/promises';
import path from 'node:path';

const DIR_OUT = path.resolve(__dirname, '..');

async function getSpecificationLinks(
	specification: Specification,
): Promise<LinkAboutSpecification[]> {
	const linksPerIntegration = await Promise.all(
		LINK_INTEGRATIONS.map((integration) =>
			integration.getLinksBySpecification(specification),
		),
	);

	return linksPerIntegration.flat();
}

async function getSpecificationsWithLinksFromIntegration<
	T extends Specification,
>(integration: SpecificationIntegration<T>): Promise<T[]> {
	const specs = await integration.getSpecifications();

	for (const spec of specs) {
		spec.links = await getSpecificationLinks(spec);

		if (spec.links.length > 0) {
			console.log('Found some links for', spec.specificationUrl);
		}
	}

	return specs;
}

const integrationsByFileName: [string, SpecificationIntegration][] = [
	['ecma262.json', ECMA262_INTEGRATION],
	['ecma402.json', ECMA402_INTEGRATION],
	['w3.json', W3_INTEGRATION],
];

for (const [outFile, integration] of integrationsByFileName) {
	const data = await getSpecificationsWithLinksFromIntegration(integration);
	await fs.writeFile(path.resolve(DIR_OUT, outFile), JSON.stringify(data));
}
