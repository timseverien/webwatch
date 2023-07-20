<script lang="ts">
	import type { SpecificationWithId } from '../data';
	import { ROUTES } from '../routes';
	import Card from './Card.svelte';
	import Flow from './Flow.svelte';
	import SpecificationName from './SpecificationName.svelte';
	import SpecificationPropertyList from './SpecificationPropertyList.svelte';
	import TagChipStatic from './integrations/TagChipStatic.svelte';

	export let specification: SpecificationWithId;

	let primaryAnchor: HTMLAnchorElement | null = null;
</script>

<Card
	color="surface"
	on:click={(event) =>
		primaryAnchor?.dispatchEvent(
			new MouseEvent(event.detail.type, {
				altKey: event.detail.altKey,
				ctrlKey: event.detail.ctrlKey,
				shiftKey: event.detail.shiftKey,
				metaKey: event.detail.metaKey,
			}),
		)}
>
	<svelte:fragment slot="header">
		<h2 class="specification-name">
			<a
				href={ROUTES.specificationWithTruncatedId.getPath(specification)}
				bind:this={primaryAnchor}
			>
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
