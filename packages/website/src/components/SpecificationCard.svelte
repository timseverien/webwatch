<script lang="ts">
	import Card from './Card.svelte';
	import SpecificationName from './SpecificationName.svelte';

	export let name: string;
</script>

<Card>
	<h2 class="specification-name">
		<SpecificationName {name} />
	</h2>
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
