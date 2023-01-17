import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

let seatList = [];
for await (const line of file.readLines()) {
    seatList.push([...line]);
}

let seatId = seatList.map(seat => {
    dl(`***Processing seat ${seat}`);
    let minRow = 0;
    let maxRow = 127;
    let minCol = 0;
    let maxCol = 7;
    seat.forEach(s => {
        if (s === "F") maxRow = (((maxRow - minRow) + 1) / 2) - 1 + minRow;
        else if (s === "B") minRow = (((maxRow - minRow) + 1) / 2) + minRow;
        else if (s === "L") maxCol = (((maxCol - minCol) + 1) / 2) - 1 + minCol;
        else if (s === "R") minCol = (((maxCol - minCol) + 1) / 2) + minCol;
        dl(`   step ${s}: ${minRow}, ${maxRow}, ${minCol}m ${maxCol}`);
    });
    let seatId = (minRow * 8) + minCol;
    dl(`SeatID: ${seatId}`);
    return seatId;
});

dl(`${JSON.stringify(seatId)}`);

console.log(`Length: ${seatId.length}`);
console.log(`Highest: ${seatId.sort((a, b) => b - a)[0]}`);
console.log(`Lowest: ${seatId.sort((a, b) => a - b)[0]}`);
