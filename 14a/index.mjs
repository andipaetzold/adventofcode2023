import { readFileSync } from "node:fs";

const input = readFileSync("input1.txt", "utf-8");
const pattern = input.split("\n").map((line) => line.split(""));
const transposedPattern = transpose(pattern);

let result = 0;
for (const column of transposedPattern) {
  let rocks = 0;
  for (let y = column.length - 1; y >= 0; y--) {
    const char = column[y];

    switch (char) {
      case ".":
        break;
      case "O":
        ++rocks;
        break;
      case "#":
        result += getRockLoad(column.length - y - 1, rocks);
        rocks = 0;
        break;
    }
  }
  result += getRockLoad(column.length, rocks);
}
console.log(result);

function transpose(arr) {
  return arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));
}

/**
 *
 * @param {number} loadOfFirstRock
 * @param {number} count
 * @returns {number}
 */
function getRockLoad(loadOfFirstRock, count) {
  let result = 0;
  for (let i = 0; i < count && loadOfFirstRock - i > 0; i++) {
    result += loadOfFirstRock - i;
  }
  return result;
}
