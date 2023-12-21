import { readFileSync } from "node:fs";

const STEPS = 64;

const DIRECTIONS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const input = readFileSync("input1.txt", "utf-8");
const lines = input.split("\n");
const map = lines.map((line) => line.split(""));

const startPositionY = map.findIndex((line) => line.includes("S"));
const startPositionX = map[startPositionY].findIndex((cell) => cell === "S");

const startPosition = [startPositionX, startPositionY];

let positions = new Set([toStr(startPosition)]);

for (let i = 0; i < STEPS; i++) {
  const newPositions = new Set();
  for (const positionStr of positions) {
    for (const direction of DIRECTIONS) {
      const position = positionStr.split(":").map(Number);
      const newPosition = [
        position[0] + direction[0],
        position[1] + direction[1],
      ];
      const cell = map[newPosition[1]]?.[newPosition[0]];
      if (cell === "." || cell === "S") {
        newPositions.add(toStr(newPosition));
      }
    }
  }
  positions = newPositions;
}

console.log(positions.size);

function toStr(position) {
  return position.join(":");
}
