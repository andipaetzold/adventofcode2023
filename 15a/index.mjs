import { readFileSync } from "node:fs";

const input = readFileSync("input1.txt", "utf-8");
const parsedInput = input.trim().split(",");

const result = parsedInput.map((str) => hash(str)).reduce((a, b) => a + b, 0);
console.log(result);

/**
 * @param {string} str
 * @returns {number}
 */
function hash(str) {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    value += str.charCodeAt(i);
    value *= 17;
    value %= 256;
  }
  return value;
}
