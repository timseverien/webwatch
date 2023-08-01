import {
	SpecificationPublisherVirtual,
	SpecificationVirtual,
} from '@spectakel/infrastructure/src/database/specification.js';

export interface SpecificationSourceIntegration {
	publisherInfo: SpecificationPublisherVirtual;
	getSpecifications(): AsyncGenerator<SpecificationVirtual>;
}
