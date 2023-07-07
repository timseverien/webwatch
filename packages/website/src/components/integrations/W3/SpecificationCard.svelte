<script lang="ts">
	import {
		W3_SPECIFICATION_TYPE_LABEL_MAP,
		type W3Specification,
	} from '@ww/core/src/integrations/w3';
	import { format } from 'date-fns';
	import SpecificationCard from '../../SpecificationCard.svelte';

	export let d: W3Specification;
	$: category =
		d.type !== 'W3_SPECIFICATION'
			? W3_SPECIFICATION_TYPE_LABEL_MAP[d.type]
			: null;
</script>

<SpecificationCard type={d.type} name={d.name} {category}>
	<svelte:fragment slot="property-list">
		<dt>Level</dt>
		<dd>{d.level}</dd>

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
