import { readFileSync } from "node:fs";

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
    if (isIntersection([y, x])) {
      nodes.push([y, x]);
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
    if (!isInBounds(cur) || !isPath(cur)) {
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
        if (!isPath(nextNodeCandidate)) {
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

// brute force
/**
 * @param {Node} node
 */
const edgesStr = edges.map(({ start, end, distance }) => ({
  start: start.join(","),
  end: end.join(","),
  distance,
}));
const edgeByStart = new Map();
for (const edge of edgesStr) {
  if (!edgeByStart.has(edge.start)) {
    edgeByStart.set(edge.start, []);
  }
  edgeByStart.get(edge.start).push(edge);
}

const startNodeStr = startNode.join(",");
const endNodeStr = endNode.join(",");

let callId = 0;
const callStack = [[callId, "part1", [startNodeStr, 0, new Set()]]];
const callResults = new Map();

while (callStack.length > 0) {
  const [id, operation, args] = callStack.shift();

  switch (operation) {
    case "part1": {
      const [node, curDistance, visited] = args;

      if (visited.has(node)) {
        callResults.set(id, 0);
        break;
      }

      if (node === endNodeStr) {
        callResults.set(id, curDistance);
        break;
      }

      const newVisited = new Set(visited);
      newVisited.add(node);

      const newCalls = [];

      for (const { end, distance } of edgeByStart.get(node)) {
        ++callId;
        newCalls.push([
          callId,
          "part1",
          [end, curDistance + distance, newVisited],
        ]);
      }

      const callIds = newCalls.map(([id]) => id);
      newCalls.push([id, "part2", [callIds]]);
      callStack.unshift(...newCalls);

      break;
    }

    case "part2": {
      const [callIds] = args;

      let result = -Infinity;
      for (const callId of callIds) {
        result = Math.max(result, callResults.get(callId));
        callResults.delete(callId);
      }
      callResults.set(id, result);
      break;
    }
  }
}

console.log(callResults.get(0));


// util
/**
 * @param {Node} node
 */
function isIntersection(node) {
  const [y, x] = node;
  return (
    isPath(node) &&
    [
      isPath([y + 1, x]),
      isPath([y - 1, x]),
      isPath([y, x + 1]),
      isPath([y, x - 1]),
    ].filter(Boolean).length > 2
  );
}

/**
 * @param {Node} node
 * @returns {boolean}
 */
function isPath(node) {
  return [".", "v", ">", "^", "<"].includes(getChar(node));
}

function isInBounds(node) {
  const [x, y] = node;
  return x >= 0 && y >= 0 && y < map.length && x < map[y].length;
}

function isEqualNode(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function getChar(node) {
  return map[node[1]]?.[node[0]];
}
