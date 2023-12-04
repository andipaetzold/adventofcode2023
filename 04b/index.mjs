import { readFileSync } from "fs";

const lines = readFileSync("input1.txt", "utf-8").split("\n");

const winsByCard = [];

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
  winsByCard.push(wins);
}

const countByCard = Array.from({ length: winsByCard.length }, () => 1);
for (let i = 0; i < countByCard.length; i++) {
  const wins = winsByCard[i];
  for (let j = 0; j < wins; j++) {
    countByCard[i + j + 1] += 1 * countByCard[i]
   
  }
}

const result = countByCard.reduce((acc, cur) => acc + cur, 0);
console.log(result)