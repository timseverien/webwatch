<script lang="ts">
	import type { TC39Proposal } from '@ww/core/src/integrations/tc39/index';
	import ProposalName from './ProposalName.svelte';

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

<table>
	<thead>
		<tr>
			<th scope="col">Proposal</th>
			<th scope="col">Stage</th>
		</tr>
	</thead>
	<tbody>
		{#each proposalsSorted as proposal}
			<tr>
				<th scope="row">
					<ProposalName name={proposal.name} />
				</th>
				<td>{proposal.stage}</td>
			</tr>
		{/each}
	</tbody>
</table>
