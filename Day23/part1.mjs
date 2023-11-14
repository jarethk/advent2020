/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const input = "389125467";
const input = "853192647";
const MAX_CYCLE = 100;

const t0 = performance.now();

let cups = input.split("").map(c => ~~c);
let min = 1;
let max = 9;

for (let cycle = 0; cycle < MAX_CYCLE; cycle++) {
    dl(`cycle ${cycle} start: ${JSON.stringify(cups)}`)
    let current = cups.shift();
    let removed = cups.splice(0, 3);
    dl(`cycle ${cycle} removed: ${JSON.stringify(cups)}`);
    let destination = current;
    do {
        destination--;
        if (destination < min) destination = max;
    } while (removed.includes(destination));
    /*
    let scups = [...cups].sort((a, b) => b - a);
    let destination = scups.find(v => v <= current - 1);
    dl(`destination: ${destination} from ${current - 1} in ${JSON.stringify(scups)}`)
    if (destination == undefined) destination = scups[0];
    */
    dl(`destination: ${destination}`)
    let dindex = cups.indexOf(destination);
    cups.splice(dindex + 1, 0, ...removed);
    dl(`cycle ${cycle} readded: ${JSON.stringify(cups)}`)
    cups.push(current);
}

console.log(`Cups after ${MAX_CYCLE} cycles: ${JSON.stringify(cups)}`)
let removed = cups.splice(0, cups.indexOf(1));
cups.shift();
cups.push(...removed);
console.log(`Final order: ${cups.join("")}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
