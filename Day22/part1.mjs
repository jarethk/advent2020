/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 1;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let player1 = [];
let player2 = [];

const PLAYER_RE = /Player\s(\d):/;
let pnum = 1;

for await (const line of file.readLines()) {
    let match;
    if ((match = PLAYER_RE.exec(line)) !== null) {
        pnum = match[1];
        dl(`got a player: ${pnum}`)
    } else if (line != "") {
        if (pnum == "1") {
            player1.push(~~line);
        } else {
            player2.push(~~line);
        }
    }
}

dl(`player 1: ${player1}`);
dl(`player 2: ${player2}`);

while (player1.length > 0 && player2.length > 0) {
    let card1 = player1.shift();
    let card2 = player2.shift();
    if (card1 > card2) {
        player1.push(card1, card2);
    } else {
        player2.push(card2, card1);
    }
}

if (player1.length > 0) {
    console.log(`Player 1 is the winner! ${player1.reverse().map((v, idx) => v * (idx + 1)).reduce((ac, cv) => ac + cv)}`)
}
if (player2.length > 0) {
    console.log(`Player 2 is the winner! ${player2.reverse().map((v, idx) => v * (idx + 1)).reduce((ac, cv) => ac + cv)}`)
}

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
