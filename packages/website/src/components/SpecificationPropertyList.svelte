<script lang="ts">
	import { format } from 'date-fns';
	import type { Specification } from '../data';
	import { getHumanReadableUrl } from '@ww/core/src/utils/url';

	export let specification: Specification;
</script>

<dl class="container">
	<dt>Level</dt>
	<dd>{specification.maturity}</dd>

	{#if specification.lastUpdated}
		<dt>Last updated</dt>
		<dd>
			<time datetime={specification.lastUpdated.toISOString()}>
				{format(specification.lastUpdated, 'PP')}
			</time>
		</dd>
	{/if}

	<dt>Specification</dt>
	<dd>
		<a href={specification.specificationUrl} target="_blank">
			{getHumanReadableUrl(specification.specificationUrl)}
		</a>
	</dd>
</dl>

<style>
	.container {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 0 0.5em;
	}

	.container dt {
		color: var(--theme-on-surface-faded);
	}
</style>
