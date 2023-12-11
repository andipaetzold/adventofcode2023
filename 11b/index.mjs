import { readFileSync } from "node:fs";

const EMPTY_FACTOR = 1000000;
const input = readFileSync("input1.txt", "utf-8");

const map = input.split("\n").map((row) => row.split(""));

let result = 0;
let distanceFromGalaxies = [];
for (let y = 0; y < map.length; y++) {
  const galaxiesInRow = map[y].filter((value) => value === "#").length;

  distanceFromGalaxies = distanceFromGalaxies.map(
    (distance) => distance + (galaxiesInRow === 0 ? EMPTY_FACTOR : 1)
  );

  result +=
    distanceFromGalaxies.reduce((sum, distance) => sum + distance, 0) *
    galaxiesInRow;

  distanceFromGalaxies.push(
    ...Array.from({ length: galaxiesInRow }, (_, i) => 0)
  );
}

distanceFromGalaxies = [];
for (let x = 0; x < map[0].length; x++) {
  const galaxiesInColumn = map
    .map((row) => row[x])
    .filter((value) => value === "#").length;

  distanceFromGalaxies = distanceFromGalaxies.map(
    (distance) => distance + (galaxiesInColumn === 0 ? EMPTY_FACTOR : 1)
  );

  result +=
    distanceFromGalaxies.reduce((sum, distance) => sum + distance, 0) *
    galaxiesInColumn;

  distanceFromGalaxies.push(
    ...Array.from({ length: galaxiesInColumn }, (_, i) => 0)
  );
}

console.log(result);
