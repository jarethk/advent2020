/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const maxrounds = 2020;

function memoryGame(startNumbers) {
    let memset = startNumbers.reduce((ac, cv, idx) => { ac[cv] = idx; return ac; }, ({}));
    let game = [...startNumbers];
    let gap = 0;
    for (let round = startNumbers.length; round < maxrounds; round++) {
        //let last = game[game.length - 1];
        let newval = gap;
        if (memset[newval] != undefined) {
            gap = round - memset[newval];
        } else {
            gap = 0;
        }
        memset[newval] = round;
        game.push(newval);
    }
    return game;
}

for await (const line of file.readLines()) {
    let res = line.split(',').map(val => ~~val);
    let game = memoryGame(res);
    console.log(`game from input ${res}:`)
    //console.log(`\t${game}`);
    console.log(`\tlast: ${game[game.length - 1]}`);
}

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
