import { readFileSync } from "fs";

const symbol = "?";

const lines = readFileSync("input1.txt", "utf-8")
  .split("\n")
  .map((l) => l.replace(/[^\d\.]/g, symbol));

let result = 0;
for (const [lineIndex, line] of lines.entries()) {
  const reNumber = /\d+/g;

  let reResult;
  while ((reResult = reNumber.exec(line)) !== null) {
    const n = parseInt(reResult[0]);
    if (reResult.index > 0 && line[reResult.index - 1] === symbol) {
      result += n;
      continue;
    } else if (
      reResult.index + reResult[0].length < line.length &&
      line[reResult.index + reResult[0].length] === symbol
    ) {
      result += n;
      continue;
    } else if (
      lineIndex > 0 &&
      lines[lineIndex - 1]
        .slice(
          Math.max(reResult.index - 1, 0),
          reResult.index + reResult[0].length + 1
        )
        .includes(symbol)
    ) {
      result += n;
      continue;
    } else if (
      lineIndex + 1 < lines.length &&
      lines[lineIndex + 1]
        .slice(
          Math.max(reResult.index - 1, 0),
          reResult.index + reResult[0].length + 1
        )
        .includes(symbol)
    ) {
      result += n;
      continue;
    }
  }
}
console.log(result);
