import { readFileSync } from "node:fs";

const MAX_STRAIGHTS = 3;

const input = readFileSync("input1.txt", "utf-8");
const matrix = input.split("\n").map((line) => line.split(""));

const width = matrix[0].length;
const height = matrix.length;

const goalPosition = [width - 1, height - 1];

const list = [
  {
    position: [0, 1],
    direction: [0, 1],
    straights: 1,
    heatLoss: +matrix[0][1],
  },
  {
    position: [1, 0],
    direction: [1, 0],
    straights: 1,
    heatLoss: +matrix[0][1],
  },
];

const visited = new Set();

while (list.length > 0) {
  const minHeatLoss = Math.min(...list.map((item) => item.heatLoss));
  const itemIndex = list.findIndex((item) => item.heatLoss === minHeatLoss);
  const item = list.splice(itemIndex, 1)[0];

  if (
    item.position[0] === goalPosition[0] &&
    item.position[1] === goalPosition[1]
  ) {
    console.log(item.heatLoss);
    break;
  }

  if (
    item.position[0] < 0 ||
    item.position[1] < 0 ||
    item.position[0] >= width ||
    item.position[1] >= height
  ) {
    continue;
  }

  const visitedKey = `${item.position.join(":")}:${
    item.straights
  }:${item.direction.join(":")}`;
  if (visited.has(visitedKey)) {
    continue;
  }

  visited.add(visitedKey);

  const directions = [
    [item.direction[1], item.direction[0]],
    [-item.direction[1], -item.direction[0]],
    ...(item.straights < MAX_STRAIGHTS ? [item.direction] : []),
  ];

  for (const direction of directions) {
    const newPositon = [
      item.position[0] + direction[0],
      item.position[1] + direction[1],
    ];

    const isSameDirection = item.direction.join(":") === direction.join(":");
    const char = matrix[newPositon[1]]?.[newPositon[0]];
    if (char === undefined) {
      continue;
    }

    const heatLoss = +char;
    list.push({
      position: newPositon,
      direction,
      straights: isSameDirection ? item.straights + 1 : 1,
      heatLoss: item.heatLoss + heatLoss,
    });
  }
}
