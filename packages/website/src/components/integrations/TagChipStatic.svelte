<script lang="ts">
	import { getLabelFromTag, type SpecificationTag } from '../../data';
	import Chip from '../Chip.svelte';

	export let elevation: number = 1;
	export let tag: SpecificationTag;

	$: label = getLabelFromTag(tag);
</script>

<Chip color="surface-dimmed" {elevation}>
	{label}
</Chip>
