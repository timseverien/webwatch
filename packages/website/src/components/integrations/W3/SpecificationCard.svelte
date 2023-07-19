<script lang="ts">
	import type { W3Specification } from '@ww/core/src/integrations/w3';
	import SpecificationCard from '../../SpecificationCard.svelte';
	import type { SpecificationWithId } from '../../../data';

	export let specification: SpecificationWithId<W3Specification>;
</script>

<SpecificationCard {specification} />
