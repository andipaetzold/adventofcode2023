import { readFileSync } from "fs";

const input = readFileSync("input1.txt", "utf-8");

let result = 0;
for (const line of input.split("\n")) {
  const [_1, first, _2, second = first] = /^[^\d]*(\d)(.*(\d))?[^\d]*$/g.exec(
    line
  );
  const number = `${first}${second}`;
  result += parseInt(number);
}

console.log(result);
