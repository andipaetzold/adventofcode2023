import { readFileSync } from "node:fs";

/**
 * @typedef {number} X
 * @typedef {number} Y
 * @typedef {number} Z
 * @typedef {[X, Y, Z]} Velocity
 * @typedef {[X, Y, Z]} Position
 */

/**
 * @typedef {Object} Hailstorm
 * @property {Position} position
 * @property {Velocity} velocity
 */

const input = readFileSync("input1.txt", "utf-8");
const lines = input.split("\n");

const wires = lines.flatMap((line) => {
  const [compA, right] = line.split(":");
  const rightSplit = right.trim().split(" ");

  return rightSplit.flatMap((compB) => {
    return [
      [compA, compB],
      [compB, compA],
    ];
  });
});

const wiresByStart = {};
for (const wire of wires) {
  wiresByStart[wire[0]] ??= [];
  wiresByStart[wire[0]].push(wire[1]);
}

const components = Array.from(new Set(wires.map(([a]) => a)).values());

const usedWires = Object.fromEntries(wires.map((wire) => [wire.join("-"), 0]));
for (let i = 0; i < components.length; ++i) {
  const path = findPathsFrom(components[i]);
  for (const wire of path) {
    usedWires[wire]++;
  }
}

const wiresToCut = Object.entries(usedWires)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3)
  .map(([wire]) => wire);

const wiresAfterCut = wires.filter(
  (wire) => !wiresToCut.includes(wire.toSorted().join("-"))
);

const groupASize = getGroupSize();
const groupBSize = components.length - groupASize;
const result = groupASize * groupBSize;
console.log(result);

function getGroupSize() {
  const groupA = new Set();
  const queue = [components[0]];
  while (queue.length > 0) {
    const currentComponent = queue.shift();
    if (groupA.has(currentComponent)) {
      continue;
    }

    groupA.add(currentComponent);

    const nextComponents = wiresAfterCut
      .filter(([a]) => a === currentComponent)
      .map(([, b]) => b);
    queue.push(...nextComponents);
  }

  return groupA.size;
}

function findPathsFrom(compA) {
  const paths = [];

  /**
   * @type {Set<string>}
   */
  const visited = new Set();
  /**
   * @type {{component: string, path: string[]}[]}
   */
  const queue = [];
  queue.push({
    component: compA,
    path: [],
  });

  while (queue.length > 0) {
    const { component: currentComponent, path: currentPath } = queue.shift();
    if (visited.has(currentComponent)) {
      continue;
    }

    paths.push(...currentPath);
    visited.add(currentComponent);

    const nextComponents = wiresByStart[currentComponent];
    const insertIndex = queue.findIndex(
      ({ path }) => path.length > currentPath.length + 1
    );
    for (const nextComponent of nextComponents) {
      const wire = [currentComponent, nextComponent].sort().join("-");
      queue.splice(insertIndex, 0, {
        component: nextComponent,
        path: [...currentPath, wire],
      });
    }
  }

  return paths;
}
