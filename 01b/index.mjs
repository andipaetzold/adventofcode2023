import { readFileSync } from "fs";

const stringToNumber = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const input = readFileSync("input1.txt", "utf-8");

let result = 0;
for (const line of input.split("\n")) {
  const first = findFirstNumber(line);
  const second = findFirstNumber(line, true);
  result += parseInt(`${first}${second}`);
}

console.log(result);

function findFirstNumber(str, reverse = false) {
  const reStr = `(\\d|${Object.keys(stringToNumber)
    .map((s) => (reverse ? reverseStr(s) : s))
    .join("|")})`;
  const re = new RegExp(reStr);
  const [result] = re.exec(reverse ? reverseStr(str) : str);
  if (!isNaN(parseInt(result))) {
    return result;
  }
  return stringToNumber[reverse ? reverseStr(result) : result];
}

function reverseStr(str) {
  return str.split("").reverse().join("");
}
