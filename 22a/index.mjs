import { readFileSync } from "node:fs";

/**
 * @typedef {number} X
 * @typedef {number} Y
 * @typedef {number} Z
 * @typedef {[X, Y, Z]} Range
 */

/**
 * @typedef {Object} Brick
 * @property {string} id
 * @property {from} Range
 * @property {to} Range
 */

const input = readFileSync("input1.txt", "utf-8");
const lines = input.split("\n");

/**
 * @type {Brick[]}
 */
const bricks = lines.map((line, lineIndex) => ({
  id: `id:${lineIndex}`,
  from: line
    .split("~")[0]
    .split(",")
    .map(Number)
    .map((v, i) => (i == 2 ? v - 1 : v)),
  to: line
    .split("~")[1]
    .split(",")
    .map(Number)
    .map((v, i) => (i == 2 ? v - 1 : v)),
}));

const width =
  Math.max(...bricks.flatMap((brick) => [brick.from[0], brick.to[0]])) + 1;
const height =
  Math.max(...bricks.flatMap((brick) => [brick.from[1], brick.to[1]])) + 1;

const stacks = Array.from({ length: width * height }, () => []);
for (const brick of bricks) {
  const [fromX, fromY, fromZ] = brick.from;
  const [toX, toY, toZ] = brick.to;

  for (let x = fromX; x <= toX; x++) {
    for (let y = fromY; y <= toY; y++) {
      for (let z = fromZ; z <= toZ; z++) {
        stacks[y * width + x][z] = brick.id;
      }
    }
  }
}

// fill with undefined
for (let i = 0; i < stacks.length; i++) {
  stacks[i] = Array.from({ length: stacks[i].length }).map(
    (_, z) => stacks[i][z] ?? undefined
  );
}

// move down

let prev = undefined;
/**
 * @type {Record<string, Set<string>>}
 */
let supportedByMap = {};

/**
 * @type {Record<string, Set<string>>}
 */
let supportsMap = {};

while (JSON.stringify(stacks) !== prev) {
  prev = JSON.stringify(stacks);
  supportedByMap = {};
  supportsMap = {};

  for (const brick of bricks) {
    supportsMap[brick.id] = new Set();
    supportedByMap[brick.id] = new Set();
  }

  for (let i = 0; i < stacks.length; i++) {
    const stack = stacks[i];
    for (let j = 0; j < stack.length; j++) {
      const bottomBrickId = stack[j];
      if (!bottomBrickId) {
        continue;
      }
      if (j === 0) {
        supportedByMap[bottomBrickId].add("ground");
      }
      const upperBrickId = stack[j + 1];

      if (!bottomBrickId || !upperBrickId) {
        continue;
      }

      if (bottomBrickId === upperBrickId) {
        continue;
      }

      supportsMap[bottomBrickId].add(upperBrickId);
      supportedByMap[upperBrickId].add(bottomBrickId);
    }
  }

  const brickIdsToMoveDown = Object.entries(supportedByMap)
    .filter(([_, supportedByList]) => supportedByList.size === 0)
    .map(([brickId]) => brickId);

  for (const brickIdToMoveDown of brickIdsToMoveDown) {
    for (let i = 0; i < stacks.length; i++) {
      stacks[i] = stacks[i].map((curBrickId, stackIndex, stack) => {
        if (stack[stackIndex + 1] === brickIdToMoveDown) {
          return brickIdToMoveDown;
        }

        if (curBrickId === brickIdToMoveDown) {
          return undefined;
        }
        return curBrickId;
      });
    }
  }
}

let result = 0;
for (const brick of bricks) {
  const bricksSupportedByThis = supportsMap[brick.id];
  if (!bricksSupportedByThis) {
    continue;
  }

  if (
    Array.from(bricksSupportedByThis.values()).every(
      (brickSupportedByThis) => supportedByMap[brickSupportedByThis].size > 1
    )
  ) {
    ++result;
  }
}
console.log(result);
