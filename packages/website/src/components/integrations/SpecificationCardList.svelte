<script lang="ts">
	import SpecificationName from '../SpecificationName.svelte';
	import Card from '../Card.svelte';
	import type { ProposalOrSpecification } from '../../data';
	import { format } from 'date-fns';

	export let ds: ProposalOrSpecification[];

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

	function getStringWithoutSymbols(str: string) {
		return str.replace(/[^a-z0-9]*/i, '');
	}
</script>

<ul class="container">
	{#each dsSorted as d}
		<li>
			<Card>
				<h2 class="proposal-name"><SpecificationName name={d.name} /></h2>
				<dl class="proposal-property-list">
					{#if d.type === 'TC39_PROPOSAL'}
						<dt>Stage</dt>
						<dd>{d.stage}</dd>
					{/if}

					{#if d.type === 'CSS_SPECIFICATION' || d.type === 'W3_SPECIFICATION'}
						<dt>Level</dt>
						<dd>{d.level}</dd>
					{/if}

					{#if d.lastUpdated}
						<dt>Last updated</dt>
						<dd>
							<time datetime={d.lastUpdated.toISOString()}>
								{format(d.lastUpdated, 'PP')}
							</time>
						</dd>
					{/if}
				</dl>
			</Card>
		</li>
	{/each}
</ul>

<style>
	.container {
		display: grid;
		grid-template-columns: repeat(auto-fit, 48ch);
		gap: 1em;

		list-style-type: none;

		margin: 0;
		padding: 0;
	}

	.proposal-name {
		font-size: inherit;
	}

	.proposal-property-list {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0 0.5em;
	}
</style>
