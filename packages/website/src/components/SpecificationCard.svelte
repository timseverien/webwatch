<script lang="ts">
	import { format } from 'date-fns';
	import type { SpecificationTag } from '../data';
	import Card from './Card.svelte';
	import Flow from './Flow.svelte';
	import SpecificationName from './SpecificationName.svelte';
	import TagChipStatic from './integrations/TagChipStatic.svelte';

	export let name: string;
	export let lastUpdated: Date | null;
	export let maturity: string;
	export let specificationUrl: string | null;
	export let tags: SpecificationTag[];
</script>

<Card color="surface">
	<svelte:fragment slot="header">
		<h2 class="specification-name">
			<SpecificationName {name} />
		</h2>
	</svelte:fragment>

	<dl class="specification-property-list">
		<dt>Level</dt>
		<dd>{maturity}</dd>

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
				<a href={specificationUrl} target="_blank"
					>{specificationUrl.replace(/https?:\/\/(www.)?/, '')}</a
				>
			</dd>
		{/if}
	</dl>

	<svelte:fragment slot="footer">
		<Flow direction="INLINE" size={0.5}>
			{#each tags as tag}
				<TagChipStatic {tag} />
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
		color: var(--theme-on-surface-faded);
	}
</style>
