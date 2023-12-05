import { readFileSync } from "fs";

const blocks = readFileSync("input1.txt", "utf-8").split("\n\n");

const seeds = parseSeeds(blocks[0]);
const mappings = blocks.slice(1).map(parseMapping);

let result = Infinity
for (const seed of seeds) {
  const location = mappings.reduce(
    (value, mapping) => mapValue(value, mapping),
    seed
  );
  result = Math.min(location, result)
}
console.log(result)

function parseSeeds(line) {
  return line
    .split(":")[1]
    .trim()
    .split(" ")
    .map((n) => +n);
}

function parseMapping(block) {
  const lines = block.split("\n").slice(1);

  return lines
    .map((line) => line.split(" ").map((n) => +n))
    .map(([destination, source, length]) => ({
      destination,
      source,
      length,
    }));
}

function mapValue(value, mapping) {
  for (const { destination, source, length } of mapping) {
    if (value >= source && value <= source + length - 1) {
      return value - source + destination;
    }
  }

  return value;
}
