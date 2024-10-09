import random from "./random.js";
function generateNode(propProb, propValue) {
  // Generate a node with a unique id
  // assign a prop:val pair to the node with a probability
  function generateProp() {
    let prop = {};
    p = random();
    console.log(p);
    if (p < propProb) {
      prop[property] = propValue;
    }
    return prop;
  }
}

function generateNodes(n, propProb, propValue) {
  let nodes = [];
  for (let i = 0; i < n; i++) {
    nodes.push(generateNode("name", propProb, propValue));
  }
  return nodes;
}
