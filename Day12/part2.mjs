import { open } from 'node:fs/promises';
import { distance } from 'geometry/manhattan.js';
import { pivot } from 'geometry/compass.js';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const directionModifiers = {
    "N": [0, 1],
    "E": [1, 0],
    "S": [0, -1],
    "W": [-1, 0]
};

const dirRE = /(\w)(\d+)/;

// in [x, y] format
let pos = [0, 0];
let waypoint = [10, 1];
for await (const line of file.readLines()) {
    let [l, act, amt] = dirRE.exec(line);
    dl(`Next step: ${act}, ${amt}`);
    if (act == "R" || act == "L") {
        if (act == "L") amt = amt * -1;
        waypoint = pivot(waypoint[0], waypoint[1], amt);
    } else if (act == "F") {
        for (let m = 0; m < amt; m++) {
            pos[0] += waypoint[0];
            pos[1] += waypoint[1];
        }
    } else {
        waypoint[0] += directionModifiers[act][0] * amt;
        waypoint[1] += directionModifiers[act][1] * amt;
    }
    dl(`++adj position: ${pos} waypoint ${waypoint}`);
}


let dist = distance([0, 0], pos);
const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
console.log(`Ending position: ${pos} waypoint ${waypoint} distance ${dist}`);

