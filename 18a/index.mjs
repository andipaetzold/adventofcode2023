import assert from "node:assert";
import { readFileSync } from "node:fs";

const input = readFileSync("input1.txt", "utf-8");
const lines = input.split("\n");

const reLine = /^([UDLR]) (\d+) \(#.{6}\)$/;

const DIRECTIONS = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
};

const trench = new Set();

let position = [0, 0];
let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
for (const line of lines) {
  const match = line.match(reLine);
  if (match === null) {
    console.error("¯\\_(ツ)_/¯");
    continue;
  }
  const [, command, distanceStr] = match;
  const direction = DIRECTIONS[command];
  const distance = +distanceStr;

  for (let i = 0; i < distance; ++i) {
    position = [position[0] + direction[0], position[1] + direction[1]];
    const positionStr = position.join(":");
    trench.add(positionStr);

    minX = Math.min(minX, position[0]);
    minY = Math.min(minY, position[1]);
    maxX = Math.max(maxX, position[0]);
    maxY = Math.max(maxY, position[1]);
  }
}

const isDug = new Set();

for (let y = minY; y <= maxY; ++y) {
  let inside = false;
  let trenchOrigin = undefined;
  for (let x = minX; x <= maxX; ++x) {
    const positionStr = [x, y].join(":");
    const isTrench = trench.has(positionStr);

    if (isTrench) {
      if (trenchOrigin === undefined) {
        const above = [x, y - 1].join(":");
        const isTrenchAbove = trench.has(above);
        const below = [x, y + 1].join(":");
        const isTrenchBelow = trench.has(below);

        if (isTrenchAbove && isTrenchBelow) {
          trenchOrigin = "single-wall";
        } else if (isTrenchAbove) {
          trenchOrigin = "from-above";
        } else if (isTrenchBelow) {
          trenchOrigin = "from-below";
        }
      }

      isDug.add(positionStr);
    } else {
      const isPrevTrench = trench.has([x - 1, y].join(":"));
      if (isPrevTrench) {
        const above = [x - 1, y - 1].join(":");
        const isTrenchAbove = trench.has(above);
        const below = [x - 1, y + 1].join(":");
        const isTrenchBelow = trench.has(below);

        switch (trenchOrigin) {
          case "single-wall":
            inside = !inside;
            break;
          case "from-above":
            if (isTrenchBelow) {
              inside = !inside;
            }
            break;
          case "from-below":
            if (isTrenchAbove) {
              inside = !inside;
            }
            break;
        }
        trenchOrigin = undefined;
      }

      if (inside) {
        isDug.add(positionStr);
      }
    }
  }
}

// print(trench);
// print(isDug);
console.log(isDug.size)

// util
function print(dug) {
  for (let y = minY; y <= maxY; ++y) {
    let row = "";
    for (let x = minX ; x <= maxX; ++x) {
      const positionStr = [x, y].join(":");
      row += dug.has(positionStr) ? "#" : ".";
    }
    console.log(row);
  }
}
