import { readFileSync } from "node:fs";

const input = readFileSync("input1.txt", "utf-8");
const matrix = input.split("\n").map((line) => line.split(""));

const knownBeams = new Map();

const beams = [
  {
    position: [0, 0],
    direction: [1, 0],
  },
];

while (beams.length > 0) {
  const beam = beams.shift();

  if (beam.position[0] < 0 || beam.position[1] < 0) {
    continue;
  }

  const char = matrix[beam.position[1]]?.[beam.position[0]];
  if (char === undefined) {
    continue;
  }

  const positionStr = beam.position.join(":");
  const directionStr = beam.direction.join(":");
  if (
    knownBeams.has(positionStr) &&
    knownBeams.get(positionStr).includes(directionStr)
  ) {
    continue;
  }
  if (!knownBeams.has(positionStr)) {
    knownBeams.set(positionStr, []);
  }
  knownBeams.get(positionStr).push(directionStr);

  switch (char) {
    case ".": {
      beams.push({
        position: [
          beam.position[0] + beam.direction[0],
          beam.position[1] + beam.direction[1],
        ],
        direction: beam.direction,
      });
      break;
    }
    case "|": {
      if (beam.direction[0] === 0) {
        // up or down
        beams.push({
          position: [
            beam.position[0] + beam.direction[0],
            beam.position[1] + beam.direction[1],
          ],
          direction: beam.direction,
        });
      } else {
        // left or right
        beams.push(
          {
            position: [beam.position[0], beam.position[1] - 1],
            direction: [0, -1],
          },
          {
            position: [beam.position[0], beam.position[1] + 1],
            direction: [0, 1],
          }
        );
      }
      break;
    }
    case "-": {
      if (beam.direction[1] === 0) {
        // left or right
        beams.push({
          position: [
            beam.position[0] + beam.direction[0],
            beam.position[1] + beam.direction[1],
          ],
          direction: beam.direction,
        });
      } else {
        // up or down
        beams.push(
          {
            position: [beam.position[0] - 1, beam.position[1]],
            direction: [-1, 0],
          },
          {
            position: [beam.position[0] + 1, beam.position[1]],
            direction: [1, 0],
          }
        );
      }
      break;
    }
    case "/": {
      const newDirection = [-beam.direction[1], -beam.direction[0]];
      beams.push({
        position: [
          beam.position[0] + newDirection[0],
          beam.position[1] + newDirection[1],
        ],
        direction: newDirection,
      });
      break;
    }
    case "\\": {
      const newDirection = [beam.direction[1], beam.direction[0]];
      beams.push({
        position: [
          beam.position[0] + newDirection[0],
          beam.position[1] + newDirection[1],
        ],
        direction: newDirection,
      });
      break;
    }
  }
}

console.log(knownBeams.size);
