<script lang="ts">
	import type { W3SpecificationLevel } from '@ww/core/src/integrations/w3';
	import type { SpecificationTag } from '../data';
	import Card from './Card.svelte';
	import Flow from './Flow.svelte';
	import SpecificationName from './SpecificationName.svelte';
	import TagChip from './integrations/TagChip.svelte';
	import type { Tc39SpecificationStage } from '@ww/core/src/integrations/tc39';
	import { format } from 'date-fns';

	export let name: string;
	export let tags: SpecificationTag[];
	export let level: Tc39SpecificationStage | W3SpecificationLevel;
	export let lastUpdated: Date | null;
	export let specificationUrl: string | null;
</script>

<Card>
	<svelte:fragment slot="header">
		<h2 class="specification-name">
			<SpecificationName {name} />
		</h2>
	</svelte:fragment>

	<dl class="specification-property-list">
		<dt>Level</dt>
		<dd>{level}</dd>

		{#if lastUpdated}
			<dt>Last updated</dt>
			<dd>
				<time datetime={lastUpdated.toISOString()}>
					{format(lastUpdated, 'PP')}
				</time>
			</dd>
		{/if}

		{#if specificationUrl}
			<dt>Specification</dt>
			<dd>
				<a href={specificationUrl} target="_blank">{specificationUrl}</a>
			</dd>
		{/if}
	</dl>

	<svelte:fragment slot="footer">
		<Flow direction="INLINE" size={0.5}>
			{#each tags as tag}
				<TagChip {tag} />
			{/each}
		</Flow>
	</svelte:fragment>
</Card>

<style>
	.specification-name {
		font-size: inherit;
	}

	.specification-property-list {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0 0.5em;
	}

	.specification-property-list dt {
		color: #888;
	}
</style>
