<script lang="ts">
	import type { Tc39Specification } from '@ww/core/src/integrations/tc39';
	import { format } from 'date-fns';
	import SpecificationCard from '../../SpecificationCard.svelte';

	export let specification: Tc39Specification;
</script>

<SpecificationCard name={specification.name} tags={specification.tags}>
	<svelte:fragment slot="property-list">
		<dt>Stage</dt>
		<dd>{specification.stage}</dd>

		{#if specification.lastUpdated}
			<dt>Last updated</dt>
			<dd>
				<time datetime={specification.lastUpdated.toISOString()}>
					{format(specification.lastUpdated, 'PP')}
				</time>
			</dd>
		{/if}
		<dt>Specification</dt>
		<dd>
			<a href={specification.specificationUrl}
				>{specification.specificationUrl}</a
			>
		</dd>
	</svelte:fragment>
</SpecificationCard>
