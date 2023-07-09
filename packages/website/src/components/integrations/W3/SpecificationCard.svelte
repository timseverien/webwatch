<script lang="ts">
	import type { W3Specification } from '@ww/core/src/integrations/w3';
	import SpecificationCard from '../../SpecificationCard.svelte';

	export let specification: W3Specification;
</script>

<SpecificationCard
	name={specification.name}
	tags={specification.tags}
	maturity={specification.maturity}
	lastUpdated={specification.lastUpdated}
	specificationUrl={specification.specificationUrl}
/>
