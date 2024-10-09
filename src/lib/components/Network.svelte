<script>
	import { networkData } from '$lib/utils/networkData.js';
	import EventChain from './EventChain.svelte';
</script>

<div class="network">
	{#each networkData as chain}
		<EventChain events={[chain, ...(chain.children || [])]} />
	{/each}
</div>

<style>
	.network {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
	}
</style>
