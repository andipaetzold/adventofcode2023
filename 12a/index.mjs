import { readFileSync } from "node:fs";

const BROKEN = ".";
const WORKING = "#";
const UNKNOWN = "?";

const input = readFileSync("input1.txt", "utf-8");

const lines = input.split("\n");

let result = 0;

for (const line of lines) {
  const [part1, part2] = line.split(" ");
  const springs = part1.split("");
  const groups = part2.split(",").map(Number);

  const combinations = calcCombinations(springs, groups).length;
  result += combinations;
}
console.log(result)

/**
 *
 * @param {(BROKEN|WORKING|UNKNOWN)[]} springs
 * @param {number[]} groups
 */
function calcCombinations(springs, groups) {
  const minimumRequiredSprings =
    groups.reduce((prev, cur) => prev + cur, 0) + groups.length - 1;
  if (springs.length < minimumRequiredSprings) {
    return [];
  }

  if (groups.length === 0) {
    if (springs.every((c) => [BROKEN, UNKNOWN].includes(c))) {
      return [new Array(springs.length).fill(BROKEN)];
    } else {
      return [];
    }
  }

  const combinations = [];
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
      const endOfLine = startPos + curGroup === springs.length;
      const combinationStart = [
        ...new Array(startPos).fill(BROKEN),
        ...new Array(curGroup).fill(WORKING),
        ...(endOfLine ? [] : [BROKEN]),
      ];

      const recCombinations = calcCombinations(
        springs.slice(combinationStart.length),
        groups.slice(1)
      );

      combinations.push(
        ...recCombinations.map((combination) => [
          ...combinationStart,
          ...combination,
        ])
      );
    }

    ++startPos;
  }

  return combinations;
}
