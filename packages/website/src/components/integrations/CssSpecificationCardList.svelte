<script lang="ts">
	import Card from '../Card.svelte';
	import type { CSSSpecification } from '@ww/core/src/integrations/w3/css';
	import type { W3SpecificationLevel } from '@ww/core/src/integrations/w3';

	export let proposals: CSSSpecification[];

	const W3_LEVEL_ORDER: W3SpecificationLevel[] = ['WD', 'CR', 'PR', 'REC'];

	$: proposalsSorted = proposals.sort((a, b) => {
		if (a.level === b.level) {
			return getStringWithoutSymbols(a.name).localeCompare(
				getStringWithoutSymbols(b.name),
			);
		}

		return W3_LEVEL_ORDER.indexOf(b.level) - W3_LEVEL_ORDER.indexOf(a.level);
	});

	function getStringWithoutSymbols(str: string) {
		return str.replace(/[^a-z0-9]*/i, '');
	}
</script>

<ul class="container">
	{#each proposalsSorted as proposal}
		<li>
			<Card>
				<h2 class="proposal-name">{proposal.name}</h2>
				<dl class="proposal-property-list">
					<dt>Stage</dt>
					<dd>{proposal.level}</dd>

					{#if proposal.relatedProperties.length > 0}
						<dt>Related properties</dt>
						<dd>
							<ul>
								{#each proposal.relatedProperties as property}
									<li><a href={property.uri}>{property.name}</a></li>
								{/each}
							</ul>
						</dd>
					{/if}

					{#if proposal.relatedDescriptors.length > 0}
						<dt>Related properties</dt>
						<dd>
							<ul>
								{#each proposal.relatedDescriptors as descriptor}
									<li><a href={descriptor.uri}>{descriptor.name}</a></li>
								{/each}
							</ul>
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
