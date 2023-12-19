import { readFileSync } from "node:fs";

/**
 * @typedef {number} RangeFrom
 * @typedef {number} RangeTo
 * @typedef {[RangeFrom, RangeTo]} Range
 */

/**
 * @typedef {Object} Part
 * @property {string} workflow
 * @property {Range} x
 * @property {Range} m
 * @property {Range} a
 * @property {Range} s
 */

const input = readFileSync("input1.txt", "utf-8");
const [inputWorkflows] = input.split("\n\n");

/**
 * @type {Map<string, (part: Part) => string>}
 */
const workflows = new Map();
const reWorkflow = /^(?<name>\w+){(?<rules>[^}]+)}$/;
const reRule = /^(?<var>\w+)(?<comparator>[<>])(?<value>\d+):(?<result>\w+)$/;
for (const inputWorkflow of inputWorkflows.split("\n")) {
  const { groups: workflowGroups } = inputWorkflow.match(reWorkflow);
  const name = workflowGroups.name;
  const rulesStr = workflowGroups.rules.split(",");

  const ruleFns = rulesStr
    .slice(0, -1)
    .map((ruleStr) => reRule.exec(ruleStr).groups)
    .map((rule) => ({
      ...rule,
      value: +rule.value,
    }))
    .map((rule) => (part) => {
      if (part.workflow) {
        return [part];
      }

      const [from, to] = part[rule.var];

      const part1 = {
        ...part,
        [rule.var]: [
          from,
          Math.min(rule.value - (rule.comparator === ">" ? 0 : 1), to),
        ],
        workflow: rule.comparator === "<" ? rule.result : undefined,
      };
      const part2 = {
        ...part,
        [rule.var]: [
          Math.max(rule.value + (rule.comparator === "<" ? 0 : 1), from),
          to,
        ],
        workflow: rule.comparator === ">" ? rule.result : undefined,
      };

      return [part1, part2].filter(
        (part) => part[rule.var][0] <= part[rule.var][1]
      );
    });

  /**
   * @param {Part} part
   * @returns {string}
   */
  const workflowFn = (part) => {
    let parts = [{ ...part, workflow: undefined }];
    for (const ruleFn of ruleFns) {
      parts = parts.flatMap((part) => ruleFn(part));
    }
    return parts.map((part) => ({
      ...part,
      workflow: part.workflow ?? rulesStr[rulesStr.length - 1],
    }));
  };
  workflows.set(name, workflowFn);
}

/**
 * @type {Part[]}
 */
const partQueue = [
  {
    workflow: "in",
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  },
];

let result = 0;
while (partQueue.length > 0) {
  const part = partQueue.pop();
  if (part.workflow === "R") {
    continue;
  }

  if (part.workflow === "A") {
    result += getPartCombinationCount(part);
    continue;
  }

  const newParts = workflows.get(part.workflow)(part);
  partQueue.push(...newParts);
}

console.log(result);

/**
 * @param {Part} part
 * @returns {number}
 */
function getPartCombinationCount(part) {
  return (
    (part.x[1] - part.x[0] + 1) *
    (part.m[1] - part.m[0] + 1) *
    (part.a[1] - part.a[0] + 1) *
    (part.s[1] - part.s[0] + 1)
  );
}
