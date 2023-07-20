import slugify from 'slugify';
import type { SpecificationWithId } from './data';

function getSlug(str: string) {
	return slugify(str).replace(/[()]+/g, '').replace(/[.]+/g, '-');
}

export const ROUTES = {
	specification: {
		getParameters(spec: SpecificationWithId) {
			return {
				id: spec.id,
			};
		},
		getPath(spec: SpecificationWithId) {
			const params = ROUTES.specification.getParameters(spec);
			return `/specification/${params.id}`;
		},
	},
	specificationWithTruncatedId: {
		getParameters(spec: SpecificationWithId) {
			return {
				id: `${spec.truncatedId}-${getSlug(spec.name.toLowerCase())}`,
			};
		},
		getPath(spec: SpecificationWithId) {
			const params = ROUTES.specificationWithTruncatedId.getParameters(spec);
			return `/specification/${params.id}`;
		},
	},
};
