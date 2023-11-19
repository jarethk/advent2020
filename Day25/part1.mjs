/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const PRIME = 20201227;
const SUBJECT = 7;

let public_keys = [];
for await (const line of file.readLines()) {
    public_keys.push(~~line);
}

let loops = [0, 0];

let value = 1;
let i = 0;
let breaks = 0;
while (loops.some(l => l == 0)) {
    i++;
    value *= SUBJECT;
    breaks += Math.floor(value / PRIME);
    value %= PRIME;
    dl(`value at cycle ${i}: ${value}; key0: ${public_keys[0]}; key1: ${public_keys[1]}; breaks: ${breaks}`);
    if (value == public_keys[0]) loops[0] = i;
    if (value == public_keys[1]) loops[1] = i;
}

console.log(`Loops: ${loops.join(",")} `);

let cycles;
let subj;
if (loops[0] < loops[1]) {
    cycles = loops[0]
    subj = public_keys[1];
}
value = 1;
for (let c = 0; c < cycles; c++) {
    value *= subj;
    value %= PRIME;
}

console.log(`Encryption key: ${value}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
