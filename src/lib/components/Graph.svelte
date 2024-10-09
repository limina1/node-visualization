<script>
  import { onMount } from "svelte";
  import EventNode from "./EventNode.svelte";

  export let data;

  let svg;
  let nodes = [];
  let links = [];

  function createNodesAndLinks() {
    const nodeMap = new Map(
      data.map((event) => [event.id, { ...event, children: [] }]),
    );

    // Create links and identify root nodes
    const rootNodes = [];
    data.forEach((event) => {
      const node = nodeMap.get(event.id);
      if (event.next) {
        const nextNode = nodeMap.get(event.next);
        links.push({ source: node, target: nextNode, isBranch: false });
        nextNode.parent = node;
      }
      if (event.branch) {
        const branchNode = nodeMap.get(event.branch);
        links.push({ source: node, target: branchNode, isBranch: true });
        node.children.push(branchNode);
        branchNode.parent = node;
      }
      if (!node.parent) {
        rootNodes.push(node);
      }
    });

    // Position nodes
    function positionNode(node, x, y, level) {
      node.x = x;
      node.y = y;
      nodes.push(node);

      // Position children (branches) vertically
      node.children.forEach((child, index) => {
        positionNode(child, x + 150, y + (index + 1) * 100, level + 1);
      });

      // Position next node in the chain
      const nextNode = nodeMap.get(node.next);
      if (nextNode && !nextNode.x) {
        positionNode(nextNode, x, y + 100, level);
      }
    }

    rootNodes.forEach((rootNode, index) => {
      positionNode(rootNode, index * 300, 50, 0);
    });
  }

  onMount(() => {
    createNodesAndLinks();
  });
</script>

<svg bind:this={svg} width="100%" height="800">
  {#each links as link}
    {#if link.isBranch}
      <path
        d={`M ${link.source.x + 50} ${link.source.y + 15}
            L ${link.source.x + 100} ${link.source.y + 15}
            L ${link.source.x + 100} ${link.target.y + 15}
            L ${link.target.x - 50} ${link.target.y + 15}`}
        fill="none"
        stroke="black"
        stroke-width="2"
      />
    {:else}
      <line
        x1={link.source.x + 50}
        y1={link.source.y + 15}
        x2={link.target.x - 50}
        y2={link.target.y + 15}
        stroke="black"
        stroke-width="2"
      />
    {/if}
  {/each}
  {#each nodes as node}
    <foreignObject x={node.x - 50} y={node.y} width="100" height="30">
      <EventNode event={node} />
    </foreignObject>
  {/each}
</svg>
