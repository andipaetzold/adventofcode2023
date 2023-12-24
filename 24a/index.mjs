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

/**
 * @type {Hailstorm[]}
 */
const hailstorms = lines.map((line) => {
  const [left, right] = line.split("@");
  const position = left.split(",").map((v) => parseInt(v.trim(), 10));
  const velocity = right.split(",").map((v) => parseInt(v.trim(), 10));
  return { position, velocity };
});

const MIN = 200000000000000;
const MAX = 400000000000000;
// const MIN = 7;
// const MAX = 27;

let result = 0;
for (let i = 0; i < hailstorms.length - 1; ++i) {
  for (let j = i + 1; j < hailstorms.length; ++j) {
    const {
      position: [x1, y1],
      velocity: [vx1, vy1],
    } = hailstorms[i];
    const {
      position: [x2, y2],
      velocity: [vx2, vy2],
    } = hailstorms[j];

    if (vx1 === vx2 && vy1 === vy2) {
      continue;
    }

    const d1 = vy1 / vx1;
    const d2 = vy2 / vx2;

    if (d1 === d2) {
      continue;
    }

    const intersectionX = (y2 - y1 + d1 * x1 - d2 * x2) / (d1 - d2);
    const intersectionY = y1 + d1 * (intersectionX - x1);

    const t1 = (intersectionX - x1) / vx1;
    const t2 = (intersectionX - x2) / vx2;

    if (t1 < 0 || t2 < 0) {
      continue;
    }

    if (
      intersectionX < MIN ||
      intersectionX > MAX ||
      intersectionY < MIN ||
      intersectionY > MAX
    ) {
      continue;
    }
    ++result;
  }
}

console.log(result);
