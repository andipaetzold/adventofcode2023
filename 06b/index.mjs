import { readFileSync } from "fs";

const [timeLine, distanceLine] = readFileSync("input1.txt", "utf-8").split(
  "\n"
);

// charge * (time - charge) = distance
// charge * time + charge^2 = distance
// charge * time + charge^2 - distance = 0
// - charge^2 + time * charge - distance = 0
// charge1 = (-time + sqrt(time^2 - 4 * (-1) * -distance)) / ((-1) * 2)
// charge2 = (-time - sqrt(time^2 - 4 * (-1) * -distance)) / ((-1) * 2)
// charge1 = (-time + sqrt(time^2 - 4 * distance)) / -2
// charge2 = (-time - sqrt(time^2 - 4 * distance)) / -2

const time = parseLine(timeLine);
const distance = parseLine(distanceLine);

const chargeTime1 = (-time + Math.sqrt(time ** 2 - 4 * distance)) / -2;
const chargeTime2 = (-time - Math.sqrt(time ** 2 - 4 * distance)) / -2;

const from = Math.ceil(chargeTime1);
const to = Math.floor(chargeTime2);

const result = to - from + 1;
console.log(result);

/**
 * @param {string} input
 */
function parseLine(line) {
  const reLine = /\d+/g;
  let numbers = "";

  let result;
  while ((result = reLine.exec(line)) !== null) {
    numbers += result[0];
  }
  return +numbers;
}
