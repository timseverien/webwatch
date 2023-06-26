<script lang="ts">
	import Card from '../Card.svelte';
	import type { CssSpecification } from '@ww/core/src/integrations/w3/css';

	export let proposals: CssSpecification[];

	const dateFormatter = new Intl.DateTimeFormat('en', { dateStyle: 'long' });

	$: proposalsSorted = proposals.sort((a, b) => {
		if (a.lastUpdated && b.lastUpdated) {
			return b.lastUpdated.getTime() - a.lastUpdated.getTime();
		}

		if (a.lastUpdated && !b.lastUpdated) return -1;
		if (!a.lastUpdated && b.lastUpdated) return 1;

		return getStringWithoutSymbols(a.name).localeCompare(
			getStringWithoutSymbols(b.name),
		);
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

					<dt>Last updated</dt>
					<dd>
						{proposal.lastUpdated &&
						!Number.isNaN(proposal.lastUpdated.getTime())
							? dateFormatter.format(proposal.lastUpdated)
							: '-'}
					</dd>

					{#if proposal.relatedProperties.length > 0}
						<dt>Related properties</dt>
						<dd>
							<ul class="property-list">
								{#each proposal.relatedProperties.sort( (a, b) => a.name.localeCompare(b.name), ) as property}
									<li><a href={property.uri}>{property.name}</a></li>
								{/each}
							</ul>
						</dd>
					{/if}

					{#if proposal.relatedDescriptors.length > 0}
						<dt>Related properties</dt>
						<dd>
							<ul class="property-list">
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

	.property-list {
		display: flex;
		flex-flow: row wrap;
		list-style-type: none;
		margin: 0;
		padding: 0;
		gap: 0.25em 0.5em;
		font-size: 0.75em;
	}
</style>
