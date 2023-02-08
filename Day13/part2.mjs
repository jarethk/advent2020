import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

function findEearliestAlignment(dataset) {
    let remapped = dataset.map((v, idx) => ({ v, idx })).filter(v => v.v != 1);
    let earliest = dataset[0];
    let increment = earliest;
    remapped.slice(1).forEach(val => {
        while ((earliest + val.idx) % val.v != 0) {
            earliest += increment;
        }
        increment = increment * val.v;
    });
    return earliest;
}

const t0 = performance.now();

let earliest = undefined;
let buses = undefined;
for await (const line of file.readLines()) {
    if (earliest == undefined) {
        earliest = ~~line;
    } else {
        buses = line.split(",").map(v => (v == "x") ? 1 : ~~v);
        earliest = findEearliestAlignment(buses);
        console.log(`Earliest is ${earliest} for ${buses}`);
    }
}


const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
console.log(`Result = ${buses} from ${earliest}`);
