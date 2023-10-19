/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';
import { getSurroundingInGrid } from 'geometry/space.js'
import { printSpace } from 'geometry/space.js';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const cycles = 6;
// this grid is z, y, x
let grid = [];
let nextGrid = [];

function newGrid(grid) {
    let newZ = grid.length + 2;
    let newY = grid[0].length + 2;
    let newX = grid[0][0].length + 2;
    let newGrid = new Array(newZ);
    for (let z = 0; z < newZ; z++) {
        newGrid[z] = new Array(newY);
        for (let y = 0; y < newY; y++) {
            newGrid[z][y] = new Array(newX).fill(".");
        }
    }
    return newGrid;
}

const t0 = performance.now();
let slice = [[]];

for await (const line of file.readLines()) {
    slice[0].push(line.split(""));
}

console.log("first grid")
printSpace(slice);
grid.push([...slice[0]]);

for (let c = 0; c < cycles; c++) {
    nextGrid = newGrid(grid);
    let maxZ = nextGrid.length - 1;
    let maxY = nextGrid[0].length - 1;
    let maxX = nextGrid[0][0].length - 1;

    for (let z = 0; z < nextGrid.length; z++) {
        for (let y = 0; y < nextGrid[z].length; y++) {
            for (let x = 0; x < nextGrid[z][y].length; x++) {
                dl(`stepping for x/y/z: ${x}/${y}/${z}`)
                let sur = getSurroundingInGrid(nextGrid, [z, y, x]);
                // here we do -1 to z,y,x because our grid is expanded compared to the original
                let active = sur.filter(p => p[0] != 0 && p[0] != maxZ && p[1] != 0 && p[1] != maxY && p[2] != 0 && p[2] != maxX)
                    .map(p => grid[p[0] - 1][p[1] - 1][p[2] - 1] == "#" ? 1 : 0)
                    .reduce((ac, cv) => ac + cv);
                if ((z == 0 || y == 0 || x == 0 || z == nextGrid.length - 1 || y == nextGrid[0].length - 1 || x == nextGrid[0][0].length - 1)) {
                    dl("--we're at the edge");
                    if (active == 3) {
                        nextGrid[z][y][x] = "#";
                    } else {
                        nextGrid[z][y][x] = ".";
                    }
                } else if (grid[z - 1][y - 1][x - 1] == "#" && (active == 2 || active == 3)) {
                    nextGrid[z][y][x] = "#";
                } else if (grid[z - 1][y - 1][x - 1] == "." && (active == 3)) {
                    nextGrid[z][y][x] = "#";
                } else {
                    nextGrid[z][y][x] = ".";
                }
                dl(`--value set as ${nextGrid[z][y][x]}`);
            }
        }
    }
    grid = nextGrid;
}

printSpace(grid);

let countActive = grid.reduce((ac, cZ) => ac + cZ.reduce((acz, cY) => acz + cY.map(v => v == "#" ? 1 : 0).reduce((acy, cv) => acy + cv, 0), 0), 0);
console.log(`countActive: ${countActive}`)

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
