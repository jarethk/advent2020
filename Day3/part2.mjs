import { open } from 'node:fs/promises';
import { multiply } from 'lodash-es';

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

function wrap(val, min, max) {
    let dist = (max - min) + 1;
    if (val < min) {
        let m = Math.abs(min - val - 1) % (dist);
        dl(` ** ${val} , ${m} ${dist}`)
        return (max - m);
    } else if (val > max) {
        let m = Math.abs(val - max - 1) % (dist);
        return min + m;
    } else {
        return val;
    }
}

function gridPrint(grid) {
    grid.forEach(line => {
        console.log(line.join(""));
    });
}

let grid = [];

for await (const line of file.readLines()) {
    grid.push([...line]);
}

gridPrint(grid);

let minX = 0;
let maxX = grid[0].length - 1;

function executeMove(pos, slope) {
    let newPos = [...pos];
    newPos[0] = wrap(pos[0] + slope[0], minX, maxX);
    newPos[1] = pos[1] + slope[1];
    return newPos;
}

function runSlope(slope) {
    let pos = [0, 0];
    let treeCount = 0;

    while (pos[1] < grid.length - 1) {
        pos = executeMove(pos, slope);
        //console.log(`evaluating pos: ${pos}`);
        if (grid[pos[1]][pos[0]] === "#") treeCount++;
        //if (grid[pos[1]][pos[0]] !== "#") grid[pos[1]][pos[0]] = "0";
        //if (grid[pos[1]][pos[0]] === "#") grid[pos[1]][pos[0]] = "X";
    }
    return treeCount;
}

let slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
];

let treeCounts = slopes.map(slope => runSlope(slope)).reduce(multiply);

//console.log(`--------------`);
//gridPrint(grid);
console.log(`tree count: ${treeCounts}`);