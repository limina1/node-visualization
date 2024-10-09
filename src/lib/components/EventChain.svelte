<script>
	import EventNode from './EventNode.svelte';

	export let events = [];
</script>

<div class="event-chain">
	{#each events as event, index}
		{#if event}
			<EventNode {event} />
			{#if index < events.length - 1}
				<div class="arrow">→</div>
			{/if}
			{#if event.kind === 30040 && event.children}
				<div class="branch">
					<div class="arrow down">↓</div>
					<svelte:self events={event.children} />
				</div>
			{/if}
		{/if}
	{/each}
</div>

<style>
	.event-chain {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.arrow {
		margin: 5px 0;
		font-size: 20px;
	}
	.down {
		transform: rotate(90deg);
	}
	.branch {
		margin-left: 30px;
	}
</style>
