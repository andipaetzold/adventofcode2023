import { readFileSync } from "fs";

const symbol = "*";

const lines = readFileSync("input1.txt", "utf-8").split("\n");

const gears = {};

for (const [lineIndex, line] of lines.entries()) {
  const reNumber = /\d+/g;

  let reResult;
  while ((reResult = reNumber.exec(line)) !== null) {
    const n = parseInt(reResult[0]);
    const numberStart = reResult.index;
    const numberEnd = reResult.index + reResult[0].length;

    if (reResult.index > 0 && line[numberStart - 1] === symbol) {
      const gearId = `${lineIndex},${numberStart - 1}`;
      gears[gearId] = [...(gears[gearId] ?? []), n];
    }

    if (numberEnd < line.length && line[numberEnd] === symbol) {
      const gearId = `${lineIndex},${numberEnd}`;
      gears[gearId] = [...(gears[gearId] ?? []), n];
    }

    const otherLineStart = Math.max(numberStart - 1, 0);
    const otherLineEnd = numberEnd + 1;

    const prevLine = lines[lineIndex - 1];
    if (
      prevLine &&
      prevLine.slice(otherLineStart, otherLineEnd).includes(symbol)
    ) {
      const gearId = `${lineIndex - 1},${
        otherLineStart +
        prevLine.slice(otherLineStart, otherLineEnd).indexOf(symbol)
      }`;
      gears[gearId] = [...(gears[gearId] ?? []), n];
    }

    const nextLine = lines[lineIndex + 1];
    if (
      nextLine &&
      nextLine.slice(otherLineStart, otherLineEnd).includes(symbol)
    ) {
      const gearId = `${lineIndex + 1},${
        otherLineStart +
        nextLine.slice(otherLineStart, otherLineEnd).indexOf(symbol)
      }`;
      gears[gearId] = [...(gears[gearId] ?? []), n];
    }
  }
}

const result = Object.values(gears)
  .filter((gear) => gear.length === 2)
  .reduce((acc, curr) => acc + curr[0] * curr[1], 0);
console.log(result);
