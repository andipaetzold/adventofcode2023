import { readFileSync } from "node:fs";

const input = readFileSync("input1.txt", "utf-8");

const map = input.split("\n").map((row) => row.split(""));
const expandedMap = map.flatMap((row) =>
  row.every((value) => value === ".") ? [row, row] : [row]
);

for (let x = 0; x < expandedMap[0].length; x++) {
  if (expandedMap.every((row) => row[x] === ".")) {
    for (const row of expandedMap) {
      row.splice(x, 0, ".");
    }
    x++;
  }
}

const galaxies = expandedMap
  .flatMap((row, y) => row.map((value, x) => ({ x, y, value })))
  .filter(({ value }) => value === "#")
  .map(({ x, y }) => ({ x, y }));

let result = 0;
for (let i = 0; i < galaxies.length; i++) {
  const galaxyA = galaxies[i];
  for (let j = i + 1; j < galaxies.length; j++) {
    const galaxyB = galaxies[j];
    const distance =
      Math.abs(galaxyA.x - galaxyB.x) + Math.abs(galaxyA.y - galaxyB.y);
    result += distance;
  }
}

console.log(result);
