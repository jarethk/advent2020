import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let voltages = [0];
let max = 0;
for await (const line of file.readLines()) {
    let val = ~~line;
    voltages.push(val);
    if (val > max) max = val;
}
voltages.push(max + 3)
voltages = voltages.sort((a, b) => a - b).map((e, i, a) => (e == 0 ? 0 : e - a[i - 1]));
dl(`${JSON.stringify(voltages)}`);
let vGroup = voltages.reduce((ac, cv) => { (ac[cv] == undefined) ? ac[cv] = 1 : ac[cv] += 1; return ac; }, {});

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
console.log(`Invalid numbers ${vGroup["1"] * vGroup["3"]}`);
