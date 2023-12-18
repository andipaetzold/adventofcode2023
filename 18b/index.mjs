import assert from "node:assert";
import { readFileSync } from "node:fs";
import { get } from "node:http";

const input = readFileSync("input1.txt", "utf-8");
const inputLines = input.split("\n");

const reLine = /^[UDLR] \d+ \(#([a-f0-9]{5})([0-3])\)$/;

const DIRECTIONS = {
  0: [1, 0], // R
  2: [-1, 0], // L
  1: [0, 1], // D
  3: [0, -1], // U
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
};

/**
 * @typedef {Object} Line
 * @property {[number, number]} from
 * @property {[number, number]} to
 * @property {[number, number]} direction
 * @property {number} length
 */

/**
 * @type {Line[]}
 */
const lines = [];

let position = [0, 0];
for (const inputLine of inputLines) {
  const match = inputLine.match(reLine);
  if (match === null) {
    console.error("¯\\_(ツ)_/¯");
    continue;
  }
  const [, distanceHex, command] = match;
  const distance = parseInt(distanceHex, 16);
  const direction = DIRECTIONS[command];

  const to = [
    position[0] + direction[0] * distance,
    position[1] + direction[1] * distance,
  ];
  lines.push({
    from: position,
    to,
    direction,
    length: distance,
  });

  position = to;
}

const minX = Math.min(...lines.map((line) => line.from[0]));
const minY = Math.min(...lines.map((line) => line.from[1]));
const maxX = Math.max(...lines.map((line) => line.from[0]));
const maxY = Math.max(...lines.map((line) => line.from[1]));

// normalize lines
for (const line of lines) {
  if (line.direction[0] < 0 || line.direction[1] < 0) {
    const tmp = line.from;
    line.from = line.to;
    line.to = tmp;
    line.direction = line.direction.map((d) => -d);
  }
}

const rowsWhereLinesStart = lines
  .map((line) => line.from[1])
  .sort((a, b) => a - b);

let dugArea = 0;

let y = minY - 1;
let dugPerRow = 0;
while (y <= maxY) {
  const nextY = rowsWhereLinesStart.find((row) => row > y);
  const diff = nextY - y;

  dugArea += diff * dugPerRow;
  y = nextY;

  const linesStartingOrEndingInThisRow = lines.filter(
    (line) => line.from[1] === y || line.to[1] === y
  );

  while (hasHorizontalLines(linesStartingOrEndingInThisRow, y)) {
    const rowInsideAreas = getInsideArea(lines, [minX, maxX], y);
    dugArea += rowInsideAreas;
    ++y;
  }
  dugPerRow = getInsideArea(lines, [minX, maxX], y);
}

console.log(dugArea);

function hasHorizontalLines(lines, y) {
  return lines.some((line) => isHorizontal(line) && line.from[1] === y);
}

function getInsideArea(lines, [minX, maxX], y) {
  let inside = false;

  let result = 0;
  let x = minX - 1;
  while (x <= maxX) {
    const nextX = Math.min(
      ...lines
        .filter(isVertical) // vertical
        .filter(
          (line) => line.from[0] > x && line.from[1] <= y && line.to[1] >= y
        )
        .map((line) => line.from[0])
    );
    if (nextX === Infinity) {
      break;
    }

    const diff = nextX - x;
    result += diff * (inside ? 1 : 0);
    x = nextX;

    const verticalLine = lines.find(
      (line) =>
        isVertical(line) &&
        line.from[0] === x &&
        line.from[1] <= y &&
        line.to[1] >= y
    );
    assert.ok(verticalLine);
    const horizontalLine = lines.find(
      (line) => line.from[0] === x && line.from[1] === y && isHorizontal(line)
    );

    if (horizontalLine === undefined) {
      // crossing the trench
      inside = !inside;
      ++x;
      ++result;
    } else {
      // corner
      const otherVerticalLine = lines.find(
        (line) =>
          isVertical(line) &&
          (isEqualPosition(horizontalLine.to, line.from) ||
            isEqualPosition(horizontalLine.to, line.to))
      );

      assert.ok(otherVerticalLine);

      if (
        (verticalLine.from[1] === y && otherVerticalLine.from[1] === y) ||
        (verticalLine.to[1] === y && otherVerticalLine.to[1] === y)
      ) {
        inside = inside;
      } else {
        inside = !inside;
      }
      x = horizontalLine.to[0] + 1;
      result += horizontalLine.length + 1;
    }
  }

  return result;
}

/**
 * @param {Line} line
 * @returns {boolean}
 */
function isVertical(line) {
  return line.direction[0] === 0;
}

/**
 * @param {Line} line
 * @returns {boolean}
 */
function isHorizontal(line) {
  return line.direction[1] === 0;
}

function isEqualPosition(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
