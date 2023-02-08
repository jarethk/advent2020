import { open } from 'node:fs/promises';

const debug = 1;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let earliest = undefined;
let buses = undefined;
for await (const line of file.readLines()) {
    if (earliest == undefined) earliest = ~~line;
    else buses = line.split(",").filter(v => v != "x").map(v => ~~v);
}

let remapped = buses.map(v => [v, v - (earliest % v)]).sort((a, b) => a[1] - b[1]);
dl(remapped);
let first = remapped[0];
const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
console.log(`Result = ${first[0] * first[1]} from ${earliest}`);
