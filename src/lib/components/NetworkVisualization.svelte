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
  };

  let svg;
  const width = 1000;
  const height = 500;
  const nodeRadius = 15;

  onMount(() => {
    drawNetwork();
  });

  function drawNetwork() {
    const nodes = [];
    const links = [];

    // Create nodes and links from networkData
    Object.entries(networkData).forEach(([source, targets]) => {
      if (!nodes.find((n) => n.id === parseInt(source))) {
        nodes.push({ id: parseInt(source) });
      }
      let prevNode = parseInt(source);
      targets.forEach((target) => {
        if (!nodes.find((n) => n.id === target)) {
          nodes.push({ id: target });
        }
        links.push({ source: prevNode, target });
        prevNode = target;
      });
    });

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(60),
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

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

    const link = g
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", "url(#arrowhead)");

    const node = g
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended),
      );

    node
      .append("circle")
      .attr("r", nodeRadius)
      .attr("fill", (d) => (networkData[d.id] ? "#4CAF50" : "#2196F3"));

    node
      .append("text")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((d) => d.id);

    // Add arrowhead marker
    svgElement
      .append("defs")
      .selectAll("marker")
      .data(["arrowhead"])
      .join("marker")
      .attr("id", (d) => d)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#999");

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

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
