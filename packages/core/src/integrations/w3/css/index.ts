import { W3Specification } from '../index.js';

interface RelatedItem {
	name: string;
	uri: string;
}

export interface CssSpecification extends W3Specification {
	relatedDescriptors: RelatedItem[];
	relatedProperties: RelatedItem[];
}

export { getSpecifications } from './client.js';
