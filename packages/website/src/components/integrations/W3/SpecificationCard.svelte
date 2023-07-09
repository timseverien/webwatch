<script lang="ts">
	import type { W3Specification } from '@ww/core/src/integrations/w3';
	import { format } from 'date-fns';
	import SpecificationCard from '../../SpecificationCard.svelte';

	export let specification: W3Specification;
</script>

<SpecificationCard name={specification.name} tags={specification.tags}>
	<svelte:fragment slot="property-list">
		<dt>Level</dt>
		<dd>{specification.level}</dd>

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
