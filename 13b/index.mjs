import { readFileSync } from "node:fs";

const input = readFileSync("input1.txt", "utf-8");
const patterns = input.split("\n\n");

let result = 0;
for (const pattern of patterns) {
  const lines = pattern.split("\n").map((line) => line.split(""));

  const height = lines.length;
  const width = lines[0].length;

  const horizontalReflections = getReflections(lines);
  const fullHorizontalReflections = Object.entries(
    horizontalReflections
  ).filter(([_, count]) => count === height - 1);

  for (const horizontalReflection of fullHorizontalReflections) {
    result += +horizontalReflection[0];
  }

  const verticalReflections = getReflections(transpose(lines));
  const fullVerticalReflections = Object.entries(verticalReflections).filter(
    ([_, count]) => count === width - 1
  );

  for (const verticalReflection of fullVerticalReflections) {
    result += +verticalReflection[0] * 100;
  }
}

console.log(result);

function getReflections(lines) {
  const height = lines.length;
  const width = lines[0].length;

  const reflections = {};
  for (let y = 0; y < height; y++) {
    const line = lines[y];

    for (let x = 1; x < width; ++x) {
      const left = line.slice(0, x);
      const right = line.slice(x);

      const minLength = Math.min(left.length, right.length);

      const leftTrimmed = left.slice(-minLength);
      const rightTrimmed = right.slice(0, minLength).reverse();

      if (isEqual(leftTrimmed, rightTrimmed)) {
        reflections[x] ??= 0;
        reflections[x]++;
      }
    }
  }

  return reflections;
}

function isEqual(a, b) {
  return a.length === b.length && a.every((c, i) => c === b[i]);
}

function transpose(arr) {
  return arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));
}
