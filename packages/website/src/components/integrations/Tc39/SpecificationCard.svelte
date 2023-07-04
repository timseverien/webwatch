<script lang="ts">
	import type { Tc39Specification } from '@ww/core/src/integrations/tc39';
	import { format } from 'date-fns';
	import SpecificationCard from '../../SpecificationCard.svelte';

	export let d: Tc39Specification;
</script>

<SpecificationCard name={d.name} category="JavaScript">
	<svelte:fragment slot="property-list">
		<dt>Stage</dt>
		<dd>{d.stage}</dd>

		{#if d.lastUpdated}
			<dt>Last updated</dt>
			<dd>
				<time datetime={d.lastUpdated.toISOString()}>
					{format(d.lastUpdated, 'PP')}
				</time>
			</dd>
		{/if}
		<dt>Specification</dt>
		<dd>
			<a href={d.specificationUrl}>{d.specificationUrl}</a>
		</dd>
	</svelte:fragment>
</SpecificationCard>
