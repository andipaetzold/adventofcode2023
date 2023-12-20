import { readFileSync } from "node:fs";

const input = readFileSync("input2.txt", "utf-8");
const lines = input.split("\n");

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

  constructor(name, destinations) {
    super(name, destinations);
  }

  prepare() {
    this.#sources = {};
    for (const module of Object.values(modules)) {
      if (module.destinations.includes(this.name)) {
        this.#sources[module.name] = "low";
      }
    }
  }

  /**
   * @param {Impulse} impulse
   */
  receiveImpulse(impulse) {
    this.#sources[impulse.source] = impulse.value;

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

let impulseCount = {
  high: 0,
  low: 0,
};
for (let i = 0; i < 1000; i++) {
  impulseQueue.push({
    source: "button",
    destination: "broadcaster",
    value: "low",
  });

  while (impulseQueue.length > 0) {
    const impulse = impulseQueue.shift();
    impulseCount[impulse.value]++;
    const module = modules[impulse.destination];
    if (!module) {
      continue;
    }
    module.receiveImpulse(impulse);
  }
}

console.log(impulseCount.high * impulseCount.low);
