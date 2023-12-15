import { readFileSync } from "node:fs";

const input = readFileSync("input1.txt", "utf-8");
const parsedInput = input.trim().split(",");

const boxes = new Map();

const reStep = /(\w+)([\-|=])(\d*)/;
for (const step of parsedInput) {
  const [_, label, operation, focalLength] = reStep.exec(step);

  const boxId = hash(label);
  if (!boxes.has(boxId)) {
    boxes.set(boxId, []);
  }

  let boxLenses = boxes.get(boxId);
  switch (operation) {
    case "-": {
      boxLenses = boxLenses.filter((lensInBox) => lensInBox.label !== label);
      break;
    }
    case "=": {
      const curLens = {
        label,
        focalLength: Number(focalLength),
      };
      if (boxLenses.some((lensInBox) => lensInBox.label === label)) {
        boxLenses = boxLenses.map((lensInBox) =>
          lensInBox.label === label ? curLens : lensInBox
        );
      } else {
        boxLenses.push(curLens);
      }
      break;
    }
  }
  boxes.set(boxId, boxLenses);
}

let result = 0;
for (const [boxId, boxLenses] of boxes.entries()) {
  for (const [slotId, { focalLength }] of Object.entries(boxLenses)) {
    result += (boxId + 1) * (+slotId + 1) * focalLength;
  }
}
console.log(result)

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
