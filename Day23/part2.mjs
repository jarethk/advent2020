/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const input = "389125467";
const input = "853192647";
//const MAX_CYCLE = 100;
//const MAX_VAL = 20;
const MAX_CYCLE = 10000000;
const MAX_VAL = 1000000;
const PRINT_FULL = 0;

const t0 = performance.now();

let cups = new Array(MAX_VAL + 1);
let inputNums = input.split("").map(c => ~~c);
inputNums.forEach((v, idx, ar) => {
    cups[v] = ar[idx + 1];
});
cups[0] = 0;

for (let n = inputNums.length + 1; n < cups.length; n++) {
    cups[n] = n + 1;
}
cups[MAX_VAL] = inputNums[0];
cups[inputNums[inputNums.length - 1]] = inputNums.length + 1;
//console.log(`Pre-processed: ${cups.map((v, idx) => idx + ":" + v).join(";")}`)

const t1a = performance.now();
console.log(`Call to part 1 took ${t1a - t0} milliseconds.`);

let current = ~~input.charAt(0);
for (let cycle = 0; cycle < MAX_CYCLE; cycle++) {
    //dl(`cycle ${cycle}; current: ${current} start: ${cups.map((v, idx) => idx + ":" + v).join(";")}`);
    let removed = [cups[current], cups[cups[current]], cups[cups[cups[current]]]];
    //dl(`cycle ${cycle} removed: ${JSON.stringify(removed)}`);
    cups[current] = cups[cups[cups[cups[current]]]];
    dl(`cycle next ${cups[current]}`)
    let destination = current - 1;
    while (removed.includes(destination) || destination == 0) {
        destination = destination == 0 ? cups.length - 1 : destination - 1;
    };
    dl(`destination: ${destination}`)
    let final = cups[destination];
    dl(`final: ${final}`)
    cups[destination] = removed[0];
    cups[removed[2]] = final;
    current = cups[current];
    //dl(`cycle ${cycle} readded: ${JSON.stringify(cups)}`)
}

//console.log(`Cups after ${MAX_CYCLE} cycles: ${JSON.stringify(cups)}`)

if (PRINT_FULL) {
    let ordered = [];
    let i = 1;
    do {
        ordered.push(cups[i]);
        i = cups[i];
    } while (i != 1);
    console.log(`Final order: ${ordered.join("")}`);
}

let plus1 = cups[1];
let plus2 = cups[cups[1]];

console.log(`parts 1 and 2: ${plus1} + ${plus2} = ${plus1 * plus2}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
