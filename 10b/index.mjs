import { readFileSync } from "node:fs";
import assert from "assert";

const input = readFileSync("input3.txt", "utf-8");

const map = input.split("\n").map((row) => row.split(""));

// pipe directions

const NORTH = [0, -1];
const SOUTH = [0, 1];
const EAST = [1, 0];
const WEST = [-1, 0];
const DIRECTIONS = [NORTH, SOUTH, EAST, WEST];

const PIPE_DIRECTIONS = {
  "|": [NORTH, SOUTH],
  "-": [EAST, WEST],
  L: [NORTH, EAST],
  J: [NORTH, WEST],
  7: [SOUTH, WEST],
  F: [SOUTH, EAST],
  S: "start",
  ".": null,
};
// start tile

const pipeDirectionsMapOrg = getPipeDirectionMap(map);

const startTileOrg = Object.entries(pipeDirectionsMapOrg)
  .find(([_, directions]) => directions === "start")[0]
  .split(":")
  .map(Number);

// replace start tile with directions

const newStartTileDirections = [];
for (const direction of DIRECTIONS) {
  const originallAdjecentToStart = move(startTileOrg, direction);

  const originallAdjecentToStartDirections =
    pipeDirectionsMapOrg[originallAdjecentToStart.join(":")];

  if (
    Array.isArray(originallAdjecentToStartDirections) &&
    originallAdjecentToStartDirections.find(
      (originallAdjecentToStartDirection) =>
        isSamePosition(originallAdjecentToStartDirection, [
          -direction[0],
          -direction[1],
        ])
    )
  ) {
    newStartTileDirections.push(direction);
  }
}

assert.equal(newStartTileDirections.length, 2);

const startTileChar = Object.entries(PIPE_DIRECTIONS)
  .filter(([_, pipeDirections]) => Array.isArray(pipeDirections))
  .find(([_, pipeDirections]) =>
    pipeDirections.every((pipeDirection) =>
      newStartTileDirections.some((newStartTileDirection) =>
        isSamePosition(pipeDirection, newStartTileDirection)
      )
    )
  )[0];

map[startTileOrg[1]][startTileOrg[0]] = startTileChar;

// expand map

const expandedMap = [];

for (const row of map) {
  const line1 = [];
  const line2 = [];

  for (const cell of row) {
    line1.push(cell);
    if (["-", "F", "L"].includes(cell)) {
      line1.push("-");
    } else {
      line1.push(".");
    }

    if (["|", "F", "7"].includes(cell)) {
      line2.push("|");
    } else {
      line2.push(".");
    }
    line2.push(".");
  }

  expandedMap.push(line1);
  expandedMap.push(line2);
}

// add border
expandedMap.unshift(
  Array.from({ length: expandedMap[0].length }).map(() => ".")
);
expandedMap.push(Array.from({ length: expandedMap[0].length }).map(() => "."));

for (const row of expandedMap) {
  row.unshift(".");
  row.push(".");
}

// pipe directions map

const pipeDirectionsMap = getPipeDirectionMap(expandedMap);

// start tile

const startTile = startTileOrg.map((coord) => 1 + coord * 2);

// main loop

const tilesAdjecentToStart = DIRECTIONS.map((direction) =>
  move(startTile, direction)
);
const firstPipes = tilesAdjecentToStart
  .map((position) => ({
    position,
    connections: pipeDirectionsMap[position.join(":")],
  }))
  .filter(({ connections }) => Array.isArray(connections))
  .filter(({ position, connections }) =>
    connections.some((connection) =>
      isSamePosition(move(position, connection), startTile)
    )
  )
  .map(({ position }) => position);

assert.equal(firstPipes.length, 2);

const firstPipe = firstPipes[0];
const mainLoop = new Set();
mainLoop.add(startTile.join(":"));
mainLoop.add(firstPipe.join(":"));

let curPosition = firstPipe;
while (curPosition) {
  const nextPositions = pipeDirectionsMap[curPosition.join(":")]
    .filter((direction) => Array.isArray(direction))
    .map((direction) => move(curPosition, direction))
    .filter((position) => !mainLoop.has(position.join(":")));

  for (const position of nextPositions) {
    mainLoop.add(position.join(":"));
  }

  curPosition = nextPositions[0];
}

//

const height = expandedMap.length;
const width = expandedMap[0].length;
let resultMap = Array.from({ length: height }).map(() =>
  Array.from({ length: width }).map(() => "?")
);

while (true) {
  const curResultMap = cloneMap(resultMap);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const position = [x, y];

      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
        curResultMap[y][x] = "O"; // O = Outside
        continue;
      }

      if (mainLoop.has(position.join(":"))) {
        curResultMap[y][x] = "M"; // M = Main loop
        continue;
      }

      for (const direction of DIRECTIONS) {
        const adjecentPosition = move(position, direction);
        const adjecentState =
          curResultMap[adjecentPosition[1]][adjecentPosition[0]];
        if (adjecentState === "O") {
          curResultMap[y][x] = "O";
          break;
        }
      }
    }
  }

  if (isEqualMap(resultMap, curResultMap)) {
    break;
  }

  resultMap = curResultMap;
}

// do not count expanded tiles

const innerTiles = Object.fromEntries(
  resultMap
    .flatMap((row, y) => row.map((cell, x) => [`${x}:${y}`, cell]))
    .filter(([_, cell]) => cell === "?")
    .filter(([position]) =>
      position.split(":").every((coord) => (coord - 1) % 2 === 0)
    )
);
const result = Object.keys(innerTiles).length;

console.log(result);

// util

function cloneMap(map) {
  return map.map((row) => row.slice());
}

function isEqualMap(a, b) {
  return a.every((row, y) => row.every((cell, x) => cell === b[y][x]));
}

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

function printMap(map) {
  const content = map.map((row) => row.join("")).join("\n");
  console.log(content);
}

/**
 * @returns {Object.<string, [number, number][]>}
 */
function getPipeDirectionMap(map) {
  return Object.fromEntries(
    map.flatMap((row, y) =>
      row.map((column, x) => [`${x}:${y}`, PIPE_DIRECTIONS[column]])
    )
  );
}
