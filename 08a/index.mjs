import { readFileSync } from "fs";

const [instructionsLine, _, ...mapLines] = readFileSync(
  "input2.txt",
  "utf-8"
).split("\n");

const map = parseMap(mapLines);

let steps = 0;
let position = "AAA";
const instructions = getInstructions(instructionsLine);
while (position !== "ZZZ") {
  const instruction = instructions.next().value;
  position = map.get(position)[instruction];
  steps++;
}
console.log(steps)

/**
 * @param {string} line
 */
function* getInstructions(line) {
  const instructions = line.split("");

  while (true) {
    for (const instruction of instructions) {
      yield instruction;
    }
  }
}

/**
 * @param {string[]} lines
 */
function parseMap(lines) {
  const re = /(\w{3}) = \((\w{3}), (\w{3})\)/;
  const result = new Map();

  for (const line of lines) {
    const [_, position, left, right] = re.exec(line);
    result.set(position, { L: left, R: right });
  }

  return result;
}
