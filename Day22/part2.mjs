/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
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

function playGame(player1, player2, gameNum) {
    let previousRounds = new Set();
    while (player1.length > 0 && player2.length > 0) {
        // rule 1, if prior round of this game had same cards for the players, player 1 wins
        if (debug && gameNum == 1) {
            console.log(`Playing round:`);
            console.log(`\tPlayer1: ${player1}`)
            console.log(`\tPlayer2: ${player2}`)
        }
        let matchRound = `${JSON.stringify(player1)}|${JSON.stringify[player2]}`;
        if (previousRounds.has(matchRound)) {
            return [1, player1];
        }
        previousRounds.add(matchRound);
        let card1 = player1.shift();
        let card2 = player2.shift();
        // rule 2, recursive
        if (card1 <= player1.length && card2 <= player2.length) {
            let winner = playGame(player1.slice(0, card1), player2.slice(0, card2), gameNum + 1);
            if (winner[0] == 1) {
                player1.push(card1, card2);
            } else {
                player2.push(card2, card1);
            }
        } else {
            // rule 3, non-recursive
            if (card1 > card2) {
                player1.push(card1, card2);
            } else {
                player2.push(card2, card1);
            }
        }
    }
    if (player1.length > 0) return [1, player1];
    else return [2, player2];
}

let winner = playGame([...player1], [...player2], 1);
console.log(`Player ${winner[0]} is the winner! ${winner[1].reverse().map((v, idx) => v * (idx + 1)).reduce((ac, cv) => ac + cv)}`);
console.log(`winning hand: ${winner[1]}`)

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
