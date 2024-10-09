<script>
	export let event;
</script>

<div class="event-node" class:kind-30040={event.kind === 30040}>
	<span>{event.kind}: {event.id}</span>
</div>

<style>
	.event-node {
		border: 1px solid #ccc;
		padding: 5px 10px;
		margin: 5px;
		display: inline-block;
		position: relative;
	}
	.kind-30040 {
		background-color: #e6f2ff;
		font-weight: bold;
	}
</style>
