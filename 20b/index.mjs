import assert from "node:assert";
import { readFileSync } from "node:fs";

const input = readFileSync("input2.txt", "utf-8");
const lines = input.split("\n");

let buttonPresses = 0;

/**
 * @typedef {Object} Impulse
 * @property {string} source
 * @property {string} destination
 * @property {'high' | 'low'} value
 */

const impulseQueue = [];
const modules = {};

class BaseModule {
  /**
   * @param {string} name
   * @param {string[]} destinations
   */
  constructor(name, destinations) {
    this.name = name;
    this.destinations = destinations;
  }

  /**
   * @param {'high' | 'low'} value
   */
  broadcastImpulse(value) {
    for (const destination of this.destinations) {
      impulseQueue.push({
        source: this.name,
        destination,
        value,
      });
    }
  }
}

class FlipFlopModule extends BaseModule {
  #state = false;

  constructor(name, destinations) {
    super(name, destinations);
  }

  /**
   * @param {Impulse} impulse
   */
  receiveImpulse(impulse) {
    if (impulse.value === "high") {
      return;
    }

    this.broadcastImpulse(this.#state ? "low" : "high");
    this.#state = !this.#state;
  }
}

class ConjunctionModule extends BaseModule {
  #sources = {};
  buttonPressesWhenInputsWereHigh = {};

  constructor(name, destinations) {
    super(name, destinations);
  }

  prepare() {
    this.#sources = {};
    for (const module of Object.values(modules)) {
      if (module.destinations.includes(this.name)) {
        this.#sources[module.name] = "low";
        this.buttonPressesWhenInputsWereHigh[module.name] = new Set();
      }
    }
  }

  /**
   * @param {Impulse} impulse
   */
  receiveImpulse(impulse) {
    this.#sources[impulse.source] = impulse.value;

    if (impulse.value === "high") {
      this.buttonPressesWhenInputsWereHigh[impulse.source].add(buttonPresses);
    }

    if (Object.values(this.#sources).every((value) => value === "high")) {
      this.broadcastImpulse("low");
    } else {
      this.broadcastImpulse("high");
    }
  }
}

class BroadcasterModule extends BaseModule {
  constructor(name, destinations) {
    super(name, destinations);
  }

  /**
   * @param {Impulse} impulse
   */
  receiveImpulse(impulse) {
    this.broadcastImpulse(impulse.value);
  }
}

for (const line of lines) {
  const [left, right] = line.split(" -> ");

  const destinations = right.split(", ");

  if (left.startsWith("%")) {
    const name = left.slice(1);
    modules[name] = new FlipFlopModule(name, destinations);
  } else if (left.startsWith("&")) {
    const name = left.slice(1);
    modules[name] = new ConjunctionModule(name, destinations);
  } else {
    const name = left;
    modules[name] = new BroadcasterModule(name, destinations);
  }
}

for (const module of Object.values(modules)) {
  if ("prepare" in module) {
    module.prepare();
  }
}

for (let i = 0; i < 10_000; ++i) {
  impulseQueue.push({
    source: "button",
    destination: "broadcaster",
    value: "low",
  });
  ++buttonPresses;

  while (impulseQueue.length > 0) {
    const impulse = impulseQueue.shift();
    const module = modules[impulse.destination];

    if (!module) {
      continue;
    }
    module.receiveImpulse(impulse);
  }
}

const moduleBeforeRx = Object.values(modules).find((module) =>
  module.destinations.includes("rx")
);
assert.ok(moduleBeforeRx);
assert.ok(moduleBeforeRx instanceof ConjunctionModule);

let result = 1;
for (const buttonPresses of Object.values(
  moduleBeforeRx.buttonPressesWhenInputsWereHigh
)) {
  const buttonPressesArray = Array.from(buttonPresses).sort();
  assert.ok(buttonPressesArray.length >= 2);

  result *= buttonPressesArray[1] - buttonPressesArray[0];
}

console.log(result);
