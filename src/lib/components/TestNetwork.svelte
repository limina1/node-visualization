<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // Sample data structure
  const networkData = {
    1: [2, 3, 4, 5],
    3: [6, 7, 8, 9, 10],
    9: [11, 12, 13, 14],
    12: [15, 16, 17, 18, 19, 20],
    21: [22, 23, 24, 25, 26, 27],
    30: [31, 32, 33, 34, 35, 36],
    33: [37, 38, 39, 40, 41, 42],
  };

  let svg;
  const width = 1000;
  const height = 500;
  const nodeRadius = 15;
  const dragRadius = 40; // Increased drag area
  const linkDistance = 40; //

  onMount(() => {
    drawNetwork();
  });

  function generateGraph(networkData) {
    /**
     * Generates a graph structure from network data.
     *
     * @param {Object} networkData - An object representing network connections.
     *                               Keys are source node IDs, and values are arrays of target node IDs.
     * @returns {Object} An object containing two properties:
     *                   - nodes: An array of node objects, each with 'id' and 'isContainer' properties.
     *                   - links: An array of link objects, each with 'source', 'target', and 'isOrthogonal' properties.
     *
     * @description
     * This function takes network data and converts it into a graph structure suitable for visualization.
     * It creates nodes for each unique ID in the network data and generates links between them.
     * Nodes are marked as containers if they have outgoing connections.
     * Links are created between nodes, with special handling for orthogonal connections.
     *
     * @example
     * const networkData = {
     *   1: [2, 3],
     *   2: [4, 5]
     * };
     * const graph = generateGraph(networkData);
     * // Returns an object with 'nodes' and 'links' arrays
     */

    const nodes = [];
    const links = [];
    const nodeMap = new Map();

    function getNode(id) {
      if (!nodeMap.has(id)) {
        const node = { id, isContainer: networkData[id] !== undefined };
        nodes.push(node);
        nodeMap.set(id, node);
      }
      return nodeMap.get(id);
    }

    Object.entries(networkData).forEach(([source, targets]) => {
      const sourceNode = getNode(parseInt(source));
      let prevNode = sourceNode;
      targets.forEach((target, index) => {
        const targetNode = getNode(parseInt(target));
        links.push({
          source: prevNode,
          target: targetNode,
          isOrthogonal: index === 0 && prevNode.id !== sourceNode.id,
        });
        prevNode = targetNode;
      });
    });

    return { nodes, links };
  }

  function drawNetwork() {
    const { nodes, links } = generateGraph(networkData);

    const svgElement = d3.select(svg).attr("viewBox", [0, 0, width, height]);

    // Enable panning and zooming
    const zoom = d3
      .zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svgElement.call(zoom);

    const g = svgElement.append("g");

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(linkDistance),
      )
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(nodeRadius * 2));

    const link = g
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#999")
      .attr("stroke-width", 2);

    const node = g
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended),
      );

    // Add larger invisible circle for dragging
    node
      .append("circle")
      .attr("r", dragRadius)
      .attr("fill", "transparent")
      .style("cursor", "move");

    node
      .append("circle")
      .attr("r", nodeRadius)
      .attr("fill", (d) => (d.isContainer ? "#4CAF50" : "#2196F3"));

    node
      .append("text")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((d) => d.id);

    simulation.on("tick", () => {
      link.attr("d", (d) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        if (d.isOrthogonal) {
          return `M${d.source.x},${d.source.y} H${d.target.x} V${d.target.y}`;
        } else {
          return `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`;
        }
      });

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
</script>

<svg bind:this={svg} {width} {height}></svg>

<style>
  svg {
    border: 1px solid #ccc;
  }
</style>
