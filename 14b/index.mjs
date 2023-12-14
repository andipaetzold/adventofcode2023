import { readFileSync } from "node:fs";

const CYCLES = 1000000000;

// definition: north is right

const input = readFileSync("input1.txt", "utf-8");
let pattern = rotate(input.split("\n").map((line) => line.split("")));

let lastSeenPattern = new Map();
for (let i = 0; i < CYCLES; i++) {
  pattern = cycle(pattern);

  const patternStr = JSON.stringify(pattern);
  if (lastSeenPattern.has(patternStr)) {
    const lastSeen = lastSeenPattern.get(patternStr);
    lastSeenPattern.clear();

    const diff = i - lastSeen;

    const remainingCycles = CYCLES - i - 1;
    const cyclesToSkip = Math.floor(remainingCycles / diff) * diff;
    i += cyclesToSkip;
  } else {
    lastSeenPattern.set(patternStr, i);
  }
}

console.log(getNorthLoad(pattern));

function getNorthLoad(arr) {
  let result = 0;
  for (const line of arr) {
    for (let x = 0; x < line.length; ++x) {
      const char = line[x];

      switch (char) {
        case ".":
        case "#":
          break;
        case "O":
          result += x + 1;
          break;
      }
    }
  }
  return result;
}

function cycle(arr) {
  let cur = arr;
  for (let i = 0; i < 4; i++) {
    cur = rollToNorth(cur);
    cur = rotate(cur);
  }
  return cur;
}

function rotate(arr) {
  return arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]).reverse());
}

function rollToNorth(arr) {
  return arr.map((line) => {
    const result = [];

    let rocks = 0;
    let empty = 0;
    for (const char of line) {
      switch (char) {
        case ".":
          ++empty;
          break;
        case "O":
          ++rocks;
          break;
        case "#":
          result.push(...new Array(empty).fill("."));
          result.push(...new Array(rocks).fill("O"));
          result.push("#");
          rocks = 0;
          empty = 0;
          break;
      }
    }
    result.push(...new Array(empty).fill("."));
    result.push(...new Array(rocks).fill("O"));

    return result;
  });
}

// util
function print(arr) {
  console.log(arr.map((line) => line.join("")).join("\n"));
}
