import { readFileSync } from "node:fs";
import assert from "node:assert";

const input = readFileSync("input1.txt", "utf-8");
const map = input.split("\n").map((line) => line.split(""));

/**
 * @typedef {number} X
 * @typedef {number} Y
 * @typedef {[X, Y]} Node
 * @typedef {[X, Y]} Direction
 */

/**
 * @typedef {Object} Edge
 * @property {Node} start
 * @property {Node} end
 * @property {number} distance
 */

/**
 * @type {Direction[]}
 */
const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const SLOPES = {
  "0:1": "v",
  "0:-1": "^",
  "1:0": ">",
  "-1:0": "<",
};

/**
 * @type {Node}
 */
const startNode = [map[0].findIndex((char) => char === "."), 0];

/**
 * @type {Node}
 */
const endNode = [map.at(-1).findIndex((char) => char === "."), map.length - 1];

// find all intersections
/**
 * @type {Node[]}
 */
const nodes = [startNode, endNode];
Array.from({ length: map.length }, (_, y) => {
  Array.from({ length: map[y].length }, (_, x) => {
    if (isIntersection([x, y])) {
      nodes.push([x, y]);
    }
  });
});

// find all edges
/**
 * @type {Edge[]}
 */
const edges = [];
for (const node of nodes) {
  for (const direction of DIRECTIONS) {
    let prev = node;
    /**
     * @type {Node}
     */
    let cur = [node[0] + direction[0], node[1] + direction[1]];
    if (!isInBounds(cur) || (!isPath(cur) && !isValidSlope(cur, direction))) {
      continue;
    }
    let distance = 1;

    while (nodes.every((n) => !isEqualNode(n, cur))) {
      /**
       * @type {Node | undefined}
       */
      let nextNode = undefined;
      for (let nextDirection of DIRECTIONS) {
        const nextNodeCandidate = [
          cur[0] + nextDirection[0],
          cur[1] + nextDirection[1],
        ];
        if (isEqualNode(prev, nextNodeCandidate)) {
          continue;
        }
        if (
          isSlope(nextNodeCandidate) &&
          !isValidSlope(nextNodeCandidate, nextDirection)
        ) {
          continue;
        }
        if (!isPathOrSlope(nextNodeCandidate)) {
          continue;
        }
        nextNode = nextNodeCandidate;
      }

      if (!nextNode) {
        break;
      }

      prev = cur;
      cur = nextNode;
      ++distance;
    }

    if (nodes.some((n) => isEqualNode(n, cur))) {
      edges.push({ start: node, end: cur, distance });
    }
  }
}

// topological sort
const sortedNodes = [];
let remainingEdges = [...edges];
let nodesWithNoIncomingEdges = nodes.filter(
  (node) => !remainingEdges.some((edge) => isEqualNode(edge.end, node))
);

while (nodesWithNoIncomingEdges.length > 0) {
  const node = nodesWithNoIncomingEdges.pop();
  sortedNodes.push(node);

  remainingEdges = remainingEdges.filter(
    (edge) => !isEqualNode(edge.start, node)
  );
  nodesWithNoIncomingEdges = nodes
    .filter(
      (node) => !remainingEdges.some((edge) => isEqualNode(edge.end, node))
    )
    .filter((node) =>
      sortedNodes.every((sortedNode) => !isEqualNode(sortedNode, node))
    );
}

// no cycles
assert.equal(remainingEdges.length, 0);

// calculate distances
const distances = {};
for (const node of sortedNodes) {
  distances[node.join(":")] = -Infinity;
}
distances[startNode.join(":")] = 0;
for (const node of sortedNodes) {
  const distance = distances[node.join(":")];
  const edgesFromNode = edges.filter((edge) => isEqualNode(edge.start, node));
  for (const edge of edgesFromNode) {
    distances[edge.end.join(":")] = Math.max(
      distances[edge.end.join(":")],
      distance + edge.distance
    );
  }
}

// result
const result = distances[endNode.join(":")];
console.log(result);

// util
/**
 * @param {Node} node
 */
function isIntersection(node) {
  const [y, x] = node;
  return (
    isPath(node) &&
    [
      isPathOrSlope([y + 1, x]),
      isPathOrSlope([y - 1, x]),
      isPathOrSlope([y, x + 1]),
      isPathOrSlope([y, x - 1]),
    ].filter(Boolean).length > 2
  );
}

/**
 *
 * @param {Node} node
 * @returns {boolean}
 */
function isPathOrSlope(node) {
  return isPath(node) || isSlope(node);
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function isPath(node) {
  return getChar(node) === ".";
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function isSlope(node) {
  return Object.values(SLOPES).includes(getChar(node));
}

function isInBounds(node) {
  const [x, y] = node;
  return x >= 0 && y >= 0 && y < map.length && x < map[y].length;
}

function isEqualNode(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function isValidSlope(node, direction) {
  return SLOPES[`${direction[0]}:${direction[1]}`] === getChar(node);
}

function getChar(node) {
  return map[node[1]]?.[node[0]];
}
