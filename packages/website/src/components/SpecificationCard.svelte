<script lang="ts">
	import type { SpecificationWithId } from '../data';
	import { getSpecificationPath } from '../data';
	import Card from './Card.svelte';
	import Flow from './Flow.svelte';
	import SpecificationName from './SpecificationName.svelte';
	import SpecificationPropertyList from './SpecificationPropertyList.svelte';
	import TagChipStatic from './integrations/TagChipStatic.svelte';

	export let specification: SpecificationWithId;
</script>

<Card color="surface">
	<svelte:fragment slot="header">
		<h2 class="specification-name">
			<a href={getSpecificationPath(specification)}>
				<SpecificationName name={specification.name} />
			</a>
		</h2>
	</svelte:fragment>

	<SpecificationPropertyList {specification} />

	<svelte:fragment slot="footer">
		<Flow direction="INLINE" size={0.5}>
			{#each specification.tags as tag}
				<TagChipStatic {tag} />
			{/each}
		</Flow>
	</svelte:fragment>
</Card>

<style>
	.specification-name {
		font-size: inherit;
	}
</style>
