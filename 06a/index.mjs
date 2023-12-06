import assert from "assert";
import { readFileSync } from "fs";

const [timeLine, distanceLine] = readFileSync("input1.txt", "utf-8").split(
  "\n"
);

const parsedTimes = parseLine(timeLine);
const parsedDistances = parseLine(distanceLine);

assert.strictEqual(parsedTimes.length, parsedDistances.length);

const races = parsedTimes.map((time, index) => {
  return {
    time,
    distance: parsedDistances[index],
  };
});

const result = races
  .map((race) => calcRace(race.time, race.distance).length)
  .reduce((acc, curr) => acc * curr, 1);
console.log(result);

/**
 * @param {number} time
 * @param {number} distance
 */
function calcRace(time, distance) {
  const chargeTimes = Array.from({ length: time - 1 }, (_, index) => index + 1);

  return chargeTimes
    .map((chargeTime) => ({
      remainingTime: time - chargeTime,
      speed: chargeTime,
    }))
    .filter(({ remainingTime, speed }) => remainingTime * speed > distance);
}

/**
 * @param {string} input
 */
function parseLine(line) {
  const reLine = /\d+/g;
  let numbers = [];

  let result;
  while ((result = reLine.exec(line)) !== null) {
    numbers.push(+result[0]);
  }
  return numbers;
}
