import assert from "assert";
import { readFileSync } from "fs";

/**
 * # Definitions
 * Cycle: The route between a two finished
 * Cycle Length: Number of steps between two finishes
 * Instruction set: All instructions
 * Instructions set length: Number of instructions before you have to start at the beginning
 *
 * # Learnings
 * A finish is always reached after the last instruction
 * Cycle lengths are a multiple of the instruction set length
 * Cycle lengths are a prime multiple of the instruction set length
 */

const [instructions, _, ...mapLines] = readFileSync(
  "input1.txt",
  "utf-8"
).split("\n");

const instructionsLength = instructions.length;

const map = parseMap(mapLines);
const ghosts = Array.from(map.keys()).filter(isStart);

const cycleLengths = ghosts.map((ghost) =>
  getCycleLength(instructions, map, ghost)
);

for (const cycleLength of cycleLengths) {
  assert.equal(cycleLength % instructionsLength, 0);
}

const instructionSetLengthsPerCycle = cycleLengths.map(
  (cycleLength) => cycleLength / instructionsLength
);
const result = instructionSetLengthsPerCycle.reduce(
  (prev, cur) => prev * cur,
  1
);
console.log(result * instructionsLength);

/**
 * @param {string[]} instructions
 * @param {ReadonlyMap<string, {L: string, R: string}>} map
 * @param {string} startPosition
 */
function getCycleLength(instructions, map, startPosition) {
  let curPosition = startPosition;
  let cycleStart = undefined;
  let steps = 0;
  for (const [instruction, instrIndex] of iterateInstructions(instructions)) {
    let nextPosition = map.get(curPosition)[instruction];

    if (isFinish(nextPosition)) {
      if (cycleStart) {
        return steps - cycleStart;
      } else {
        cycleStart = steps;
      }
    }

    curPosition = nextPosition;
    steps++;
  }
}

/**
 * @param {string[]} instructions
 * @param {ReadonlyMap<string, {L: string, R: string}>} map
 * @param {string} startPosition
 */
function findCircle(instructions, map, startPosition) {
  let firstFinish = undefined;
  let curPosition = startPosition;
  let steps = 0;
  for (const [instruction, instrIndex] of iterateInstructions(instructions)) {
    let nextPosition = map.get(curPosition)[instruction];

    if (isFinish(nextPosition) && !firstFinish) {
      firstFinish = [nextPosition, steps];
    } else if (isFinish(nextPosition) && firstFinish[0] === nextPosition) {
      console.log(firstFinish);
      return;
    }

    curPosition = nextPosition;
    steps++;
  }
}

/**
 * @param {string[]} positions
 * @returns
 */
function allFinished(ghosts) {
  return (
    ghosts.every(({ position }) => position[2] === "Z") &&
    ghosts.every(({ steps }) => ghosts[0].steps === steps)
  );
}

/**
 * @param {string} position
 * @returns {boolean}
 */
function isStart(position) {
  return position[2] === "A";
}

/**
 * @param {string} position
 * @returns {boolean}
 */
function isFinish(position) {
  return position[2] === "Z";
}

/**
 * @param {string} line
 * @param {number} startAt
 */
function* iterateInstructions(line, startAt = 0) {
  let lineSplit = line.split("");

  startAt = startAt % lineSplit.length;
  lineSplit = [...lineSplit.slice(startAt), ...lineSplit.slice(0, startAt)];

  while (true) {
    for (let i = 0; i < lineSplit.length; i++) {
      yield [lineSplit[i], i];
    }
  }
}

/**
 * @param {string[]} lines
 */
function parseMap(lines) {
  const re = /(\w{3}) = \((\w{3}), (\w{3})\)/;
  const result = new Map();

  for (const line of lines) {
    const [_, position, left, right] = re.exec(line);
    result.set(position, { L: left, R: right });
  }

  return result;
}
