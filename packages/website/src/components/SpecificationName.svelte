<script lang="ts">
	export let name: string;

	$: nameWithoutSymbols = name.replace(/`(.+?)`/g, '<code>$1</code>');
</script>

<span>{@html nameWithoutSymbols}</span>
