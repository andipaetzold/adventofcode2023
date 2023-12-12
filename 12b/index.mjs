import { readFileSync } from "node:fs";

const BROKEN = ".";
const WORKING = "#";
const UNKNOWN = "?";

const input = readFileSync("input1.txt", "utf-8");

const lines = input.split("\n");

const memoizedCalc = memoize(calcCombinations);

let result = 0;

for (const line of lines) {
  const [part1, part2] = line.split(" ");

  const part1Unfolded = Array.from({ length: 5 }, () => part1).join("?");
  const springs = part1Unfolded.split("");

  const part2Unfolded = Array.from({ length: 5 }, () => part2).join(",");
  const groups = part2Unfolded.split(",").map(Number);

  const combinations = memoizedCalc(springs, groups);
  result += combinations;
}
console.log(result);

/**
 *
 * @param {(BROKEN|WORKING|UNKNOWN)[]} springs
 * @param {number[]} groups
 */
function calcCombinations(springs, groups) {
  const minimumRequiredSprings =
    groups.reduce((prev, cur) => prev + cur, 0) + groups.length - 1;
  if (springs.length < minimumRequiredSprings) {
    return 0;
  }

  if (groups.length === 0) {
    if (springs.every((c) => [BROKEN, UNKNOWN].includes(c))) {
      return 1;
    } else {
      return 0;
    }
  }

  let combinations = 0;
  const curGroup = groups[0];

  const firstWorking = springs.findIndex((c) => c === WORKING);

  let startPos = 0;
  while (
    startPos < springs.length - minimumRequiredSprings + 1 &&
    (startPos <= firstWorking || firstWorking === -1)
  ) {
    if (
      springs
        .slice(startPos, startPos + curGroup)
        .every((c) => [WORKING, UNKNOWN].includes(c)) &&
      ([BROKEN, UNKNOWN].includes(springs[startPos + curGroup]) ||
        startPos + curGroup === springs.length)
    ) {
      const isEndOfLine = startPos + curGroup === springs.length;
      const combinationStartPos = startPos + curGroup + (isEndOfLine ? 0 : 1);

      const recCombinations = memoizedCalc(
        springs.slice(combinationStartPos),
        groups.slice(1)
      );

      combinations += recCombinations;
    }

    ++startPos;
  }

  return combinations;
}

function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);

    return result;
  };
}
