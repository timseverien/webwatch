<script lang="ts">
	import Card from './Card.svelte';
	import Chip from './Chip.svelte';
	import Flow from './Flow.svelte';
	import SpecificationName from './SpecificationName.svelte';

	export let name: string;
	export let category: string | null = null;
</script>

<Card>
	<svelte:fragment slot="header">
		<Flow direction="INLINE" justify="SPACE-BETWEEN">
			<h2 class="specification-name">
				<SpecificationName {name} />
			</h2>
			{#if category}
				<Chip>{category}</Chip>
			{/if}
		</Flow>
	</svelte:fragment>

	<dl class="specification-property-list">
		<slot name="property-list" />
	</dl>
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
