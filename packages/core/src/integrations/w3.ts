import { getSpecifications } from '@spectakel/infrastructure/src/integrations/specifications/w3/client.js';
import { SpecificationSourceIntegration } from '../specification/source.js';

export const INTEGRATION_W3: SpecificationSourceIntegration = {
	publisherInfo: {
		key: 'W3',
		name: 'W3',
		url: 'https://w3c.org',
	},

	getSpecifications,
};
