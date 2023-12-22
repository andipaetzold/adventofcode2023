import { readFileSync } from "node:fs";
import { getPositionsCount, getPositionsCountAfterSteps } from "./util.mjs";
import assert from "node:assert";

const input = readFileSync("input1.txt", "utf-8");
const lines = input.split("\n");
const map = lines.map((line) => line.split(""));
const width = map[0].length;
const height = map.length;

assert.equal(width, height);

// row and column of start are empty
// first and last row/column empty
// there are diagonal lines between the centers of each side
// it takes 131 steps (width/height) to fill the map from the center

const halfSize = Math.floor(width / 2);

const coreOdd = getPositionsCountAfterSteps(map, halfSize);
const coreEven = getPositionsCountAfterSteps(map, halfSize - 1);
const outerOdd =
  getPositionsCountAfterSteps(map, halfSize - 2, [0, 0]) +
  getPositionsCountAfterSteps(map, halfSize - 2, [0, height - 1]) +
  getPositionsCountAfterSteps(map, halfSize - 2, [width - 1, 0]) +
  getPositionsCountAfterSteps(map, halfSize - 2, [width - 1, height - 1]);
const outerEven =
  getPositionsCountAfterSteps(map, halfSize - 1, [0, 0]) +
  getPositionsCountAfterSteps(map, halfSize - 1, [0, height - 1]) +
  getPositionsCountAfterSteps(map, halfSize - 1, [width - 1, 0]) +
  getPositionsCountAfterSteps(map, halfSize - 1, [width - 1, height - 1]);

const steps = 26_501_365;

const factor = (steps - halfSize) / (2 * width);
const coreOddCount = (1 + factor * 2) ** 2;
const coreEvenCount = (factor * 2) ** 2;
const outerOddCount = (1 + factor * 2) * (factor * 2);
const outerEvenCount = (1 + factor * 2) * (factor * 2);
const result =
  coreOddCount * coreOdd +
  coreEvenCount * coreEven +
  outerOddCount * outerOdd +
  outerEvenCount * outerEven;

console.log(result);
