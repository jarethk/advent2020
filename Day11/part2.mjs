import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const adjacentMap = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1]
];

function gridPrint(grid) {
    grid.forEach(line => {
        console.log(line.join(""));
    });
}


function getSeat(sm, x, y, adj) {
    let nx = x + adj[1];
    let ny = y + adj[0];
    while (sm[ny] != undefined && sm[ny][nx] != undefined) {
        if (sm[ny][nx] != ".") return sm[ny][nx];
        nx += adj[1];
        ny += adj[0];
    }
    //dl(`++checking for seat ${ny}, ${nx}: ${sm[ny] ? sm[ny][nx] : "-"}`);
    if (sm[ny] != undefined && sm[ny][nx] != undefined) return sm[ny][nx];
    return "";
}

let seatMap = [];
for await (const line of file.readLines()) {
    seatMap.push(line.split(""));
}

let cycles = 0;
let changes = 1;
let occupied = 0;
gridPrint(seatMap);
while (changes > 0) {
    cycles++;
    changes = 0;
    occupied = 0;
    let newMap = [];
    for (let y = 0; y < seatMap.length; y++) {
        newMap.push([...seatMap[y]]);
        for (let x = 0; x < seatMap[y].length; x++) {
            if (seatMap[y][x] == ".") continue;
            let adjSeats = adjacentMap.map(adj => getSeat(seatMap, x, y, adj));
            dl(`**Adjacent seats from ${y},${x}: ${adjSeats.join("")}`);
            let adjOcc = adjSeats.filter(v => v == "#").length;
            if (seatMap[y][x] == "L" && adjOcc == 0) { newMap[y][x] = "#"; changes++; }
            if (seatMap[y][x] == "#" && adjOcc >= 5) { newMap[y][x] = "L"; changes++; }
            if (newMap[y][x] == "#") occupied++;
        }
    }
    seatMap = newMap;
    dl(`-----------------`);
    if (debug) gridPrint(seatMap);
    console.log(`Round ${cycles}: ${occupied} occupied with ${changes} changes`);
}

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
