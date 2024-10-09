<script>
	import { networkData } from '$lib/utils/networkData.js';

	export let eventId;

	$: events = networkData.containers[eventId] || [];
</script>

<div class="container">
	<h3>{eventId}</h3>
	<ul>
		{#each events as event}
			<li>
				{#if networkData.containers[event]}
					<svelte:self eventId={event} />
				{:else}
					{event}
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.container {
		border: 1px solid #ccc;
		padding: 10px;
		margin: 10px 0;
	}
	ul {
		list-style-type: none;
		padding-left: 20px;
	}
</style>
