/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 1;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const maxrounds = 30000000;

function memoryGame(startNumbers) {
    let memset = new Array(maxrounds);
    startNumbers.forEach((v, idx) => memset[v] = idx);
    let last = startNumbers[startNumbers.length - 1];
    let gap = 0;
    for (let round = startNumbers.length; round < maxrounds; round++) {
        let newval = gap;
        if (memset[newval] != undefined) {
            gap = round - memset[newval];
        } else {
            gap = 0;
        }
        memset[newval] = round;
        last = newval;
    }
    return last;
}

for await (const line of file.readLines()) {
    let res = line.split(',').map(val => ~~val);
    let last = memoryGame(res);
    console.log(`game from input ${res}:`)
    //console.log(`\t${game}`);
    console.log(`\tlast: ${last}`);
}

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
