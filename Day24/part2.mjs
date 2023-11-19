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

function hexAdjacent(point) {
    return Object.keys(HEX_MOVE_SET).map(dir => hexMove(point, dir));
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

tileGrid = Object.entries(tileGrid).filter(kv => kv[1] === 1).reduce((ac, cv) => { ac[cv[0]] = cv[1]; return ac; }, {});
console.log(`black tiles: ${Object.values(tileGrid).reduce((ac, cv) => ac + cv)}`);


function lifeMatchingCheck(grid, current, weight) {
    return (weight == 2 || grid[current] && weight == 1);
}


function gameOfLife(grid, cycles, getAdjacentCallback, matchingCallback) {
    let gameGrid = grid;
    for (let c = 0; c < cycles; c++) {
        let rGrid = Object
            .entries(Object.keys(gameGrid)
                .flatMap(pt => getAdjacentCallback(pt.split("|").map(c => ~~c))
                    .map(n => n.join("|")))
                .reduce((ng, cv) => { ng[cv] ? ng[cv] += 1 : ng[cv] = 1; return ng; }, {}))
            .filter(pair => matchingCallback(gameGrid, pair[0], pair[1]))
            .reduce((ng, cv) => { ng[cv[0]] = 1; return ng; }, {});
        dl(`step ${c} newGrid: ${JSON.stringify(rGrid)}`)
        gameGrid = rGrid;
    }
    return gameGrid;
}

const MAX_DAYS = 100;
let resultGrid = gameOfLife(tileGrid, MAX_DAYS, hexAdjacent, lifeMatchingCheck);

console.log(`countActive 2: ${Object.keys(resultGrid).length}`)

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
