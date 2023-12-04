import { readFileSync } from "fs";

const lines = readFileSync("input1.txt", "utf-8");

const reGameId = /Game (\d+)/;

function parseLine(str) {
  const [game, gameData] = str.split(": ");
  const [_, gameId] = reGameId.exec(game);

  const handsStr = gameData.split("; ");
  const hands = handsStr.map((hand) =>
    Object.fromEntries(
      hand
        .split(", ")
        .map((cubeCount) => cubeCount.split(" "))
        .map(([count, color]) => [color, parseInt(count)])
    )
  );

  return {
    gameId: parseInt(gameId),
    hands,
  };
}

function isValid(value, max) {
  for (const [color, maxValue] of Object.entries(max)) {
    if (value[color] > maxValue) {
      return false;
    }
  }
  return true;
}

let result = 0;
for (const line of lines.split("\n")) {
  const parsedLine = parseLine(line);

  const colors = {};
  for (const hand of parsedLine.hands) {
    for (const [color, count] of Object.entries(hand)) {
      colors[color] = Math.max(colors[color] ?? 0, +count);
    }
  }

  const power = Object.values(colors).reduce((acc, curr) => acc * curr, 1);
  result += power;
}
console.log(result);
