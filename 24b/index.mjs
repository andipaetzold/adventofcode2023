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
const allHailstorms = lines.map((line) => {
  const [left, right] = line.split("@");
  const position = left.split(",").map((v) => parseInt(v.trim(), 10));
  const velocity = right.split(",").map((v) => parseInt(v.trim(), 10));
  return { position, velocity };
});

const vxs = getStoneVelocity(allHailstorms, 0);
const vys = getStoneVelocity(allHailstorms, 1);
const vzs = getStoneVelocity(allHailstorms, 2);

/**
 * @param {Hailstorm[]} hailstorms
 * @param {number} dimension
 * @returns {number}
 */
function getStoneVelocity(hailstorms, dimension) {
  // if (dimension === 2) {
  //   return 2;
  // }

  const hailstormVelocities = new Set(
    hailstorms.map((hailstorm) => hailstorm.velocity[dimension])
  );

  let i = 1;
  while (true) {
    factorLoop: for (const factor of [1, -1]) {
      const stoneVelocity = i * factor;

      for (const hailstormVelocity of hailstormVelocities) {
        const hailstormsWithVelocity = hailstorms.filter(
          (hailstorm) => hailstorm.velocity[dimension] === hailstormVelocity
        );
        if (hailstormsWithVelocity.length <= 1) {
          continue;
        }

        for (let j = 1; j < hailstormsWithVelocity.length; ++j) {
          const diff =
            hailstormsWithVelocity[j].position[dimension] -
            hailstormsWithVelocity[0].position[dimension];
          const t = diff / (stoneVelocity - hailstormVelocity);
          if (!Number.isInteger(t)) {
            continue factorLoop;
          }
        }
      }

      return stoneVelocity;
    }

    ++i;
  }
}

/**
 * @param {Hailstorm[]} hailstorms 
 * @returns [number, number, number]
 */
function getStonePositions(hailstorms) {
  const vxs = getStoneVelocity(hailstorms, 0);
  const vys = getStoneVelocity(hailstorms, 1);
  const vzs = getStoneVelocity(hailstorms, 2);

  const hailstormVelocities = {};
  for (const hailstorm of hailstorms) {
    hailstormVelocities[hailstorm.velocity[0]] ??= 0;
    hailstormVelocities[hailstorm.velocity[0]]++;
  }

  const hailstormVelocity = +Object.entries(hailstormVelocities).find(
    ([_, count]) => count > 1
  )[0];
  const [hailstorm1, hailstorm2] = hailstorms.filter(
    (hailstorm) => hailstorm.velocity[0] === hailstormVelocity
  );
  const diff = hailstorm2.position[0] - hailstorm1.position[0];
  const tDiff = diff / (vxs - hailstormVelocity);

  const [x1, y1, z1] = hailstorm1.position;
  const [x2, y2, z2] = hailstorm2.position;
  const [vx1, vy1, vz1] = hailstorm1.velocity;
  const [vx2, vy2, vz2] = hailstorm2.velocity;

  /**
   * y1 + t1 * vy1 + tDiff * vys = y2 + (t1 + tDiff) * vy2
   * y1 + t1 * vy1 + tDiff * vys = y2 + t1 * vy2 + tDiff * vy2
   * t1 * vy1 + tDiff * vys = y2 + t1 * vy2 + tDiff * vy2 - y1
   * t1 * vy1 = y2 + t1 * vy2 + tDiff * vy2 - y1 - tDiff * vys
   * t1 * vy1 - t1 * vy2 = y2 + tDiff * vy2 - y1 - tDiff * vys
   * t1 * (vy1 - vy2) = y2 + tDiff * vy2 - y1 - tDiff * vys
   * t1 = (y2 + tDiff * vy2 - y1 - tDiff * vys) / (vy1 - vy2)
   */
  const t1 = (y2 + tDiff * vy2 - y1 - tDiff * vys) / (vy1 - vy2);

  return [
    x1 + t1 * vx1 - t1 * vxs,
    y1 + t1 * vy1 - t1 * vys,
    z1 + t1 * vz1 - t1 * vzs,
  ];
}

const [xs, ys, zs] = getStonePositions(allHailstorms);

verify(xs, ys, zs, vxs, vys, vzs, allHailstorms);

const result = xs + ys + zs;
console.log(result);

function verify(xs, ys, zs, vxs, vys, vzs, hailstorms) {
  for (const hailstorm of hailstorms) {
    const [x, y, z] = hailstorm.position;
    const [vx, vy, vz] = hailstorm.velocity;

    const t = (x - xs) / (vxs - vx);
    if (!Number.isInteger(t)) {
      return false;
    }

    if (xs + t * vxs !== x + t * vx) {
      return false;
    }

    if (ys + t * vys !== y + t * vy) {
      return false;
    }
    if (zs + t * vzs !== z + t * vz) {
      return false;
    }
  }
  return true;
}
