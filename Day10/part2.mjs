import { open } from 'node:fs/promises';
import path from 'node:path';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input1.txt");
//const file = await open("./sample-input2.txt");
const file = await open("./full-input.txt");

function clamp(num, min, max) {
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

function tribonacciSet(len) {
    let op = [1];
    for (let f = 1; f < len; f++) {
        op.push(op.slice(clamp(f - 3, 0, len - 1), f).reduce((a, b) => a + b));
    }
    return op;
}

const t0 = performance.now();

let voltages = [0];
let max = 0;
for await (const line of file.readLines()) {
    let val = ~~line;
    voltages.push(val);
    if (val > max) max = val;
}
voltages.push(max + 3)
voltages = voltages.sort((a, b) => a - b);
dl(`${JSON.stringify(voltages)}`);
voltages = voltages.map((e, i, a) => (e == 0 ? 0 : e - a[i - 1]));
dl(`${JSON.stringify(voltages)}`);
let vGroup = voltages.reduce((ac, cv) => { (ac[cv] == undefined) ? ac[cv] = 1 : ac[cv] += 1; return ac; }, {});

let len = 7;
let triop = tribonacciSet(len);

let vPaths = voltages.reduce((ac, cv) => { cv == 3 || cv == 0 ? ac.push(0) : ac[ac.length - 1] == 0 ? ac.push(1) : ac[ac.length - 1] += 1; return ac; }, [])
    .filter(v => v != 0);
dl(`${JSON.stringify(vPaths)}`);
vPaths = vPaths.map(v => triop[v]);
dl(`${JSON.stringify(vPaths)}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
console.log(`Invalid numbers ${vGroup["1"] * vGroup["3"]}`);
console.log(`Paths: ${vPaths}: ${vPaths.reduce((ac, cv) => ac * cv, 1)}`);

