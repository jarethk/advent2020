/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let rule0 = "";
let rules = {};
let messages = [];

const RULE_RE = /^(\d+):\s"?([^"]+)"?$/;

for await (const line of file.readLines()) {
    if (RULE_RE.test(line)) {
        let parts = line.match(RULE_RE);
        let newRule = parts[2];
        rules[parts[1]] = newRule;
    } else {
        messages.push(line);
    }
}

//console.log(`messages: ${JSON.stringify(messages)}`);

let rq = [];
let nextRules = ["0"];
while (nextRules.length > 0) {
    rq.unshift(...nextRules);
    console.log(`-- mapping the next set of rules ${nextRules}`)
    nextRules = nextRules
        .map(rn => rules[rn])
        .flatMap(r => r.split(" ").filter(c => /\d+/.test(c)))
        .filter(r => /\d/.test(rules[r]))
    nextRules = [... new Set(nextRules)];
}

console.log(JSON.stringify(rq));
console.log(JSON.stringify([...new Set(rq)]));

while (rq.length > 0) {
    let rtp = rq.shift();
    rules[rtp] = rules[rtp]
        .split(" ")
        .map(c => c === "|" ? "|" : rules[c])
        .join("");
    if (rq.length > 0) rules[rtp] = "(" + rules[rtp] + ")"
}

console.log(rules["0"]);

let valid = messages.map(m => new RegExp("^" + rules["0"] + "$").test(m) ? 1 : 0).reduce((ac, cv) => ac + cv);
console.log(`valid: ${valid}`)

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
