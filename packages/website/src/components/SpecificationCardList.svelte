<script lang="ts">
	import {
		isTc39Specification,
		isW3Specification,
		type Specification,
	} from '../data';
	import Tc39SpecificationCard from './integrations/Tc39/SpecificationCard.svelte';
	import W3SpecificationCard from './integrations/W3/SpecificationCard.svelte';

	export let ds: Specification[];

	function getStringWithoutSymbols(str: string) {
		return str.replace(/[^a-z0-9]*/i, '');
	}

	$: dsSorted = ds.sort((a, b) => {
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

<ul class="container">
	{#each dsSorted as d}
		<li>
			{#if isTc39Specification(d)}
				<Tc39SpecificationCard {d} />
			{:else if isW3Specification(d)}
				<W3SpecificationCard {d} />
			{/if}
		</li>
	{/each}
</ul>

<style>
	.container {
		display: grid;
		grid-template-columns: repeat(auto-fit, 60ch);
		gap: 1em;

		margin: 0;
		padding: 0;
		list-style-type: none;
	}
</style>
