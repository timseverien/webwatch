<script lang="ts">
	import type { Tc39Specification } from '@ww/core/src/integrations/tc39';
	import SpecificationCard from '../../SpecificationCard.svelte';

	export let specification: Tc39Specification;
</script>

<SpecificationCard
	name={specification.name}
	tags={specification.tags}
	maturity={specification.maturity.toString()}
	lastUpdated={specification.lastUpdated}
	specificationUrl={specification.specificationUrl}
/>
