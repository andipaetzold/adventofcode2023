import { readFileSync } from "fs";

const lines = readFileSync("input1.txt", "utf-8").split("\n");

let result = 0;

const reLine = /^Card\s+\d+:\s+(?<win>((\d+)\s+)+)\|(?<have>(\s+(\d+))+)$/;
for (const line of lines) {
  const match = reLine.exec(line);
  const winningNumbers = match.groups.win
    .trim()
    .split(" ")
    .map((s) => s.trim())
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n));
  const havingNumbers = match.groups.have
    .trim()
    .split(" ")
    .map((s) => s.trim())
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n));

  const wins = havingNumbers.filter((n) => winningNumbers.includes(n)).length;
  if (wins > 0) {
    const points = Math.pow(2, wins - 1);
    result += points;
  }
}

console.log(result);
