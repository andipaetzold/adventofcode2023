import { readFileSync } from "node:fs";

const input = readFileSync("input2.txt", "utf-8");

const NORTH = [0, -1];
const SOUTH = [0, 1];
const EAST = [1, 0];
const WEST = [-1, 0];
const DIRECTIONS = [NORTH, SOUTH, EAST, WEST];

const PIPES = {
  "|": [NORTH, SOUTH],
  "-": [EAST, WEST],
  L: [NORTH, EAST],
  J: [NORTH, WEST],
  7: [SOUTH, WEST],
  F: [SOUTH, EAST],
  S: "start",
  ".": null,
};

/**
 * @type {Object.<string, [number, number][]>}
 */
const pipeMap = Object.fromEntries(
  input
    .split("\n")
    .flatMap((row, rowIndex) =>
      row
        .split("")
        .map((column, columnIndex) => [
          `${columnIndex}:${rowIndex}`,
          PIPES[column],
        ])
    )
);

/**
 * @type {[x: number, y: number]}
 */
const startTile = Object.entries(pipeMap)
  .find(([, value]) => value === "start")[0]
  .split(":")
  .map(Number);

const firstPipes = DIRECTIONS.map((direction) => move(startTile, direction))
  .map((position) => ({
    position,
    connections: pipeMap[position.join(":")],
  }))
  .filter(({ connections }) => !!connections)
  .filter(({ position, connections }) =>
    connections.some((connection) =>
      isSamePosition(move(position, connection), startTile)
    )
  )
  .map(({ position }) => position);

const distanceToStart = {
  [startTile.join(":")]: 0,
  ...Object.fromEntries(
    firstPipes.map((position) => [[position.join(":")], 1])
  ),
};

let curPositions = firstPipes;

let steps = 2;
while (curPositions.length > 0) {
  const nextPositions = curPositions
    .map((position) => ({
      position,
      directions: pipeMap[position.join(":")],
    }))
    .filter(({ directions }) => Array.isArray(directions))
    .flatMap(({ position, directions }) =>
      directions.map((direction) => move(position, direction))
    )
    .filter((position) => distanceToStart[position.join(":")] === undefined);

  for (const nextPosition of nextPositions) {
    distanceToStart[nextPosition.join(":")] = steps;
  }

  curPositions = nextPositions;
  ++steps;
}

const result = Math.max(...Object.values(distanceToStart));
console.log(result);

/**
 *
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @returns {boolean}
 */
function isSamePosition(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 *
 * @param {[number, number]} position
 * @param {[number, number]} delta
 * @returns {[number, number]}
 */
function move(position, delta) {
  return [position[0] + delta[0], position[1] + delta[1]];
}
