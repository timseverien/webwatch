<script lang="ts">
	import type { SpecificationWithId } from '../data';
	import Tc39SpecificationCard from './integrations/Tc39/SpecificationCard.svelte';
	import W3SpecificationCard from './integrations/W3/SpecificationCard.svelte';

	export let specifications: SpecificationWithId[];

	function getStringWithoutSymbols(str: string) {
		return str.replace(/[^a-z0-9]*/i, '');
	}

	$: specificationsSorted = specifications.sort((a, b) => {
		const timeA = a.lastUpdated?.getTime() ?? 0;
		const timeB = b.lastUpdated?.getTime() ?? 0;

		if (timeA !== timeB) {
			return timeB - timeA;
		}

		return getStringWithoutSymbols(a.name).localeCompare(
			getStringWithoutSymbols(b.name),
		);
	});
</script>

<div class="container">
	{#each specificationsSorted as spec}
		{#if spec.type === 'TC39_SPECIFICATION'}
			<Tc39SpecificationCard specification={spec} />
		{:else if spec.type === 'W3_SPECIFICATION'}
			<W3SpecificationCard specification={spec} />
		{/if}
	{/each}
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: repeat(auto-fill, 50ch);
		gap: 1em;
	}
</style>
