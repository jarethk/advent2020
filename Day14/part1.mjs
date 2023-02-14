/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const andtranslate = { 'X': '1', '1': '1', '0': '0' }
let andmask = 1;
const ortranslate = { 'X': '0', '1': '1', '0': '0' }
let ormask = 0;
let mem = [];
for await (const line of file.readLines()) {
    if (/mask\s=/.test(line)) {
        let res = line.match(/mask\s=\s([X01]+)/);
        let mask = res[1];
        console.log(mask);
        andmask = BigInt("0b" + [...mask].map(v => andtranslate[v]).join(""));
        ormask = BigInt("0b" + [...mask].map(v => ortranslate[v]).join(""));
    } else {
        //mem[8] = 11
        let res = line.match(/mem\[(\d+)\]\s=\s(\d+)/);
        let reg = ~~res[1];
        let val = BigInt(~~res[2]);
        mem[reg] = ((val & andmask) | ormask);
    }
}

//dl(`Memory: ${JSON.stringify(mem)}`);
console.log(mem.reduce((ac, cv) => ac + cv));
const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
//console.log(`Result = ${first[0] * first[1]} from ${earliest}`);
