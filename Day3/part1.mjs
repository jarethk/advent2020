import { open } from 'node:fs/promises';
import { wrap } from 'num-wrap';

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

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

let pos = [0, 0];
let move = [3, 1];

function executeMove() {
    pos[0] = wrap(pos[0] + move[0], minX, maxX);
    pos[1] = pos[1] + move[1];
}

let treeCount = 0;

while (pos[1] < grid.length - 1) {
    executeMove();
    //console.log(`evaluating pos: ${pos}`);
    if (grid[pos[1]][pos[0]] === "#") treeCount++;
    if (grid[pos[1]][pos[0]] !== "#") grid[pos[1]][pos[0]] = "0";
    if (grid[pos[1]][pos[0]] === "#") grid[pos[1]][pos[0]] = "X";
}

console.log(`--------------`);
gridPrint(grid);
console.log(`tree count: ${treeCount}`);