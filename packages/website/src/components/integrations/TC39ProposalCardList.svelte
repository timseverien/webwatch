<script lang="ts">
	import type { TC39Proposal } from '@ww/core/src/integrations/tc39/index';
	import ProposalName from '../ProposalName.svelte';
	import Card from '../Card.svelte';

	export let proposals: TC39Proposal[];

	$: proposalsSorted = proposals.sort((a, b) => {
		if (a.stage === b.stage) {
			return getStringWithoutSymbols(a.name).localeCompare(
				getStringWithoutSymbols(b.name),
			);
		}

		return b.stage - a.stage;
	});

	function getStringWithoutSymbols(str: string) {
		return str.replace(/[^a-z0-9]*/i, '');
	}
</script>

<ul class="container">
	{#each proposalsSorted as proposal}
		<li>
			<Card>
				<h2 class="proposal-name"><ProposalName name={proposal.name} /></h2>
				<dl class="proposal-property-list">
					<dt>Stage</dt>
					<dd>{proposal.stage}</dd>
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
