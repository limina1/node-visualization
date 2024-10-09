<script>
import { onMount } from 'svelte';
import { select } from 'd3-selection';

// Helper function to generate a random hex string
const randomHex = (length) => [...Array(length)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

// Generate random events
const generateEvents = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: randomHex(16),
    kind: Math.random() < 0.1 ? 30040 : 30041, // 10% chance of being 30040
  }));
};

// Helper function to generate a random 2D unit vector
const randomVector = () => {
  const angle = Math.random() * 2 * Math.PI;
  return [Math.cos(angle), Math.sin(angle)];
};

// Create the structure
const createStructure = (events) => {
  const structure = { vector: randomVector(), events: [] };
  let currentBranch = structure;

  events.forEach(event => {
    if (event.kind === 30040) {
      const newBranch = { vector: randomVector(), events: [event] };
      currentBranch.events.push(newBranch);
      currentBranch = newBranch;
    } else {
      currentBranch.events.push(event);
    }
  });


  return structure;
};

let svgElement;

onMount(() => {
  const events = generateEvents(100);
  const structure = createStructure(events);

  const width = 1200;
  const height = 800;

  const svg = select(svgElement)
    .attr('width', width)
    .attr('height', height);

  const g = svg.append('g')
    .attr('transform', `translate(${width/5}, ${height/5})`);

  const drawBranch = (branch, startX, startY, scale = 1) => {
    let currentX = startX;
    let currentY = startY;
    const [vx, vy] = branch.vector;

    branch.events.forEach((event, index) => {
      if (typeof event === 'object' && event.vector) {
        // This is a 30040 event (sub-branch)
        drawBranch(event, currentX, currentY, scale );
      } else {
        // This is a 30041 event
        g.append('circle')
          .attr('cx', currentX)
          .attr('cy', currentY)
          .attr('r', 4 )
          .attr('fill', '#bbf');

        g.append('text')
          .attr('x', currentX)
          .attr('y', currentY)
          .attr('text-anchor', 'middle')
          .attr('font-size', 10)
          .text(event.id.substring(0, 4));
       

        if (index > 0) {
          g.append('line')
            .attr('x1', currentX - vx * 30 )
            .attr('y1', currentY - vy * 30 )
            .attr('x2', currentX)
            .attr('y2', currentY)
            .attr('stroke', '#ccc')
            .attr('stroke-width', scale);
        }
      }

      currentX += vx * 30 * scale;
      currentY += vy * 30 * scale;
    });
  };

  drawBranch(structure, 0, 0);
});
</script>

<div class="nostr-knowledge-structure">
  <svg bind:this={svgElement}></svg>
</div>

<style>
  .nostr-knowledge-structure {
    width: auto;
    height: 100%;

    overflow: auto;
  }
</style>
