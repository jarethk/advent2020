/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

// coordinate movements in x/y format
const HEX_MOVE_SET = {
    'nw': [0, -1],
    'ne': [1, -1],
    'e': [1, 0],
    'se': [0, 1],
    'sw': [-1, 1],
    'w': [-1, 0]
};

function hexMove(point, dir) {
    let move = HEX_MOVE_SET[dir];
    return [point[0] + move[0], point[1] + move[1]];
}

const t0 = performance.now();

let tileGrid = {};

const DIRECTION_RE = /nw|ne|e|se|sw|w/g;
for await (const line of file.readLines()) {
    let matches = line.match(DIRECTION_RE);
    let point = [0, 0];
    matches.forEach(dir => { point = hexMove(point, dir) });
    dl(`flipping point ${point}`);
    let lbl = point[0] + "|" + point[1];
    if (tileGrid[lbl] === 1) {
        tileGrid[lbl] = 0;
    } else {
        tileGrid[lbl] = 1;
    }
}

console.log(`black tiles: ${Object.values(tileGrid).filter(kv => kv === 1).reduce((ac, cv) => ac + cv)}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
