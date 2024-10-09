import random from './random.js';
interface Node {
    id: string;
    tags: string[];
}

const generateNode = (props, probs)) => {
    // Generate a node with the given properties and values at the given probabilities
    tags = []
    for (let i = 0; i < props.length; i++) {
        if (Math.random() < probs[i]) {
            tags.push(props[i])
        }
    }
    return {
        id: Math.random().toString(36).substring(7),
        tags: tags
    }

}

function generateNodes(n: number, props: string[], probs: number[]) {
    // Generate a network with n nodes
    let nodes: Node[] = []
    for (let i = 0; i < n; i++) {
        nodes.push(generateNode(props, probs))
    }
    return nodes

}
