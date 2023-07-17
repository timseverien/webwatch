<script lang="ts">
	import {
		SPECIFICATION_TAG_LABEL_MAP,
		type SpecificationTag,
	} from '../../data';
	import Chip from '../Chip.svelte';

	export let elevation: number = 1;
	export let tag: SpecificationTag;

	$: label = SPECIFICATION_TAG_LABEL_MAP[tag];
</script>

<Chip color="surface-dimmed" {elevation}>
	{label}
</Chip>
