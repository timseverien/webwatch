<script lang="ts">
	import type { Tc39Specification } from '@spectakel/core/src/integrations/tc39';
	import SpecificationCard from '../../SpecificationCard.svelte';
	import type { SpecificationWithId } from '../../../data';

	export let specification: SpecificationWithId<Tc39Specification>;
</script>

<SpecificationCard {specification} />
