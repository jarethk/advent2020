import { open } from 'node:fs/promises';
import { distance } from 'geometry/manhattan.js';
import { turn } from 'geometry/compass.js';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const directionModifiers = {
    "N": [0, -1],
    "E": [1, 0],
    "S": [0, 1],
    "W": [-1, 0]
};

const dirRE = /(\w)(\d+)/;

let pos = [0, 0];
let facing = "E";
for await (const line of file.readLines()) {
    let [l, act, amt] = dirRE.exec(line);
    dl(`Next step: ${act}, ${amt}`);
    if (act == "R" || act == "L") {
        facing = turn(facing, act, amt);
    } else {
        if (act == "F") act = facing;
        dl(`New facing: ${facing}`);
        pos[0] += directionModifiers[act][0] * amt;
        pos[1] += directionModifiers[act][1] * amt;
    }
    dl(`++adj position: ${pos} facing ${facing}`);
}


let dist = distance([0, 0], pos);
const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
console.log(`Ending position: ${pos} facing ${facing} distance ${dist}`);

