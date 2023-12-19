import { readFileSync } from "node:fs";

/**
 * @typedef {Object} Part
 * @property {number} x
 * @property {number} m
 * @property {number} a
 * @property {number} s
 */

const input = readFileSync("input1.txt", "utf-8");
const [inputWorkflows, inputParts] = input.split("\n\n");

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
    .map((rule) => (part) => {
      const value = part[rule.var];
      if (
        (value > rule.value && rule.comparator === ">") ||
        (value < rule.value && rule.comparator === "<")
      ) {
        return rule.result;
      }
      return undefined;
    });

  /**
   * @param {Part} part
   * @returns {string}
   */
  const workflowFn = (part) => {
    for (const ruleFn of ruleFns) {
      const result = ruleFn(part);
      if (result !== undefined) {
        return result;
      }
    }
    return rulesStr[rulesStr.length - 1];
  };
  workflows.set(name, workflowFn);
}

let result = 0;
const rePart = /^{x=(?<x>\d+),m=(?<m>\d+),a=(?<a>\d+),s=(?<s>\d+)}$/;
for (const inputPart of inputParts.split("\n")) {
  const { groups: partGroups } = inputPart.match(rePart);
  /** @type {Part} */
  const part = {
    x: Number(partGroups.x),
    m: Number(partGroups.m),
    a: Number(partGroups.a),
    s: Number(partGroups.s),
  };

  let curWorkflow = "in";
  while (!["A", "R"].includes(curWorkflow)) {
    curWorkflow = workflows.get(curWorkflow)(part);
  }
  if (curWorkflow === "A") {
    result += getVarSum(part);
  }
}
console.log(result)

/**
 * @param {Part} part
 * @returns {number}
 */
function getVarSum(part) {
  return part.x + part.m + part.a + part.s;
}
