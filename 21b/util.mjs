import { DIRECTIONS } from "./constants.mjs";

export function setToString(arr) {
  return JSON.stringify(Array.from(arr).sort());
}

export function toStr(position) {
  return position.join(":");
}

/**
 * @param {string[][]} map
 */
export function getPositionsCount(map) {
  const startPosition = getStartPosition(map);
  let positions = new Set([toStr(startPosition)]);
  let knownPositions = new Set([setToString(positions)]);
  let positionsPerMapOdd = 0;
  let positionsPerMapEven = 0;

  for (let i = 0; i < Infinity; i++) {
    const newPositions = new Set();
    for (const positionStr of positions) {
      for (const direction of DIRECTIONS) {
        const position = positionStr.split(":").map(Number);
        const newPosition = [
          position[0] + direction[0],
          position[1] + direction[1],
        ];
        const cell = map[newPosition[1]]?.[newPosition[0]];
        if (cell === "." || cell === "S") {
          newPositions.add(toStr(newPosition));
        }
      }
    }
    positions = newPositions;

    if (i % 2 === 0) {
      positionsPerMapEven = positions.size;
    } else {
      positionsPerMapOdd = positions.size;
    }

    if (knownPositions.has(setToString(positions))) {
      break;
    }

    knownPositions.add(setToString(positions));
  }

  return {
    even: positionsPerMapEven,
    odd: positionsPerMapOdd,
  };
}

export function getPositionsCountAfterSteps(map, steps, startPositionInput) {
  const startPosition = startPositionInput ?? getStartPosition(map);
  let positions = new Set([toStr(startPosition)]);
  for (let i = 0; i < steps; i++) {
    const newPositions = new Set();
    for (const positionStr of positions) {
      for (const direction of DIRECTIONS) {
        const position = positionStr.split(":").map(Number);
        const newPosition = [
          position[0] + direction[0],
          position[1] + direction[1],
        ];

        const cell = map[newPosition[1]]?.[newPosition[0]];

        if (cell !== "." && cell !== "S") {
          continue;
        }

        const newPositionStr = toStr(newPosition);
        newPositions.add(newPositionStr);
      }
    }
    positions = newPositions;
  }

  return positions.size;
}

/**
 * @param {string[][]} map
 * @returns {[number, number]}
 */
export function getStartPosition(map) {
  const startPositionY = map.findIndex((line) => line.includes("S"));
  const startPositionX = map[startPositionY].findIndex((cell) => cell === "S");
  const startPosition = [startPositionX, startPositionY];
  return startPosition;
}

