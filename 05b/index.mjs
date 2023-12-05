import { readFileSync } from "fs";

const blocks = readFileSync("input1.txt", "utf-8").split("\n\n");

const seedRanges = parseSeeds(blocks[0]);
const mappingLists = blocks.slice(1).map(parseMappingList);

let curRanges = seedRanges.slice(0, 1);
for (const mappings of mappingLists) {
  const result = [];
  for (const curRange of curRanges) {
    result.push(...mapRange(curRange, mappings));
  }
  curRanges = result;
}
const result = curRanges.sort((a, b) => a[0] - b[0])[0][0];
console.log(result);

function parseSeeds(line) {
  const values = line
    .split(":")[1]
    .trim()
    .split(" ")
    .map((n) => +n);

  const result = [];
  for (let i = 0; i < values.length; i += 2) {
    result.push([values[i], values[i] + values[i + 1] - 1]);
  }
  return result;
}

function parseMappingList(block) {
  const lines = block.split("\n").slice(1);

  return lines
    .map((line) => line.split(" ").map((n) => +n))
    .map(([destination, source, length]) => ({
      from: [source, source + length - 1],
      destination,
    }))
    .sort((a, b) => a.from[0] - b.from[0]);
}

function inRange(range, value) {
  return value >= range[0] && value <= range[1];
}

function mapRange(sourceRange, mappingList) {
  const [sourceFrom, sourceTo] = sourceRange;

  const result = [];

  // mappings is sorted
  for (const mapping of mappingList) {
    if (mapping.from[0] > sourceTo) {
      result.push(sourceRange);
      return result;
    }

    if (mapping.from[1] < sourceFrom) {
      continue;
    }

    if (inRange(mapping.from, sourceFrom) && inRange(mapping.from, sourceTo)) {
      return [
        [
          mapping.destination + (sourceFrom - mapping.from[0]),
          mapping.destination + (sourceTo - mapping.from[0]),
        ],
      ];
    }

    if (inRange(mapping.from, sourceFrom)) {
      result.push([
        mapping.destination + (sourceFrom - mapping.from[0]),
        mapping.destination + (mapping.from[1] - mapping.from[0]),
      ]);
      result.push(...mapRange([mapping.from[1] + 1, sourceTo], mappingList));
      return result;
    }

    if (inRange(mapping.from, sourceTo)) {
      result.push([sourceFrom, mapping.from[0] - 1]);
      result.push([
        mapping.destination,
        mapping.destination + (sourceTo - mapping.from[0]),
      ]);
      return result;
    }
  }

  return [sourceRange];
}
