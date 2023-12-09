import { readFileSync } from "fs";

const lines = readFileSync("input1.txt", "utf-8")
  .split("\n")
  .map((line) => line.split(" ").map(Number));

let result = 0;
for (const line of lines) {
  // calc differences
  let differences = [line];
  while (!isAllZero(differences.at(-1))) {
    differences.push(getDifferences(differences.at(-1)));
  }

  // calc result
  let firstValues = differences.map((arr) => arr.at(0));
  const lineResult = firstValues
    .reverse()
    .reduce((prev, cur, index) =>  (index === 0 ? 0 : cur - prev));
  result += lineResult;
}

console.log(result);

/**
 * @param {number[]} arr
 * @returns {number[]}
 */
function getDifferences(arr) {
  return Array.from({ length: arr.length - 1 }, (_, i) => arr[i + 1] - arr[i]);
}

/**
 * @param {number[]} arr
 * @returns {boolean}
 */
function isAllZero(arr) {
  return arr.every((item) => item === 0);
}
