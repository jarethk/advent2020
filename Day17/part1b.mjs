/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';
import { getSurrounding } from 'geometry/space.js'
import { printSpace } from 'geometry/space.js';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const cycles = 6;

const t0 = performance.now();
let ingrid = {};

let y = 0;
for await (const line of file.readLines()) {
    line.split("").forEach((v, idx) => {
        if (v === "#") ingrid[`0|${y}|${idx}`] = 1;
    });
    y++;
}

let grid = ingrid;

for (let c = 0; c < cycles; c++) {
    let rGrid = Object
        .entries(Object.keys(grid)
            .flatMap(pt => getSurrounding(pt.split("|").map(c => ~~c))
                .map(n => n.join("|")))
            .reduce((ng, cv) => { ng[cv] ? ng[cv] += 1 : ng[cv] = 1; return ng; }, {}))
        .filter(pair => (pair[1] == 3 || (pair[1] == 2 && grid[pair[0]])))
        .reduce((ng, cv) => { ng[cv[0]] = 1; return ng; }, {});
    dl(`step ${c} newGrid: ${JSON.stringify(rGrid)}`)
    grid = rGrid;
}

console.log(`countActive 2: ${Object.keys(grid).length}`)

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
