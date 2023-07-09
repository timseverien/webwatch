<script lang="ts">
	import type { SpecificationTag } from '../data';
	import Card from './Card.svelte';
	import Flow from './Flow.svelte';
	import SpecificationName from './SpecificationName.svelte';
	import TagChip from './integrations/TagChip.svelte';

	export let name: string;
	export let tags: SpecificationTag[];
</script>

<Card>
	<svelte:fragment slot="header">
		<h2 class="specification-name">
			<SpecificationName {name} />
		</h2>
	</svelte:fragment>

	<Flow>
		<dl class="specification-property-list">
			<slot name="property-list" />
		</dl>
		<Flow direction="INLINE" size={0.5}>
			{#each tags as tag}
				<TagChip {tag} />
			{/each}
		</Flow>
	</Flow>
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
</style>
