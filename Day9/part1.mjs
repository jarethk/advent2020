import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");


function findMatchingPair(numbers, target) {
    for (let p1 = 1; p1 < numbers.length; p1++) {
        for (let p2 = 0; p2 < p1; p2++) {
            if (numbers[p1] + numbers[p2] == target) {
                return [numbers[p1], numbers[p2]];
            }
        }
    }
    return [];
}

function clamp(num, min, max) {
    if (num < min) return min;
    if (num > max) return max;
    return num;
}

const t0 = performance.now();

const preamble = 25;

let numberSet = [];
let invalidNum = undefined;
for await (const line of file.readLines()) {
    let lastNum = ~~line;
    if (numberSet.length >= preamble) {
        if (findMatchingPair(numberSet, lastNum).length == 0) invalidNum = lastNum;
        numberSet.shift();
    }
    numberSet.push(lastNum);
    if (invalidNum != undefined) break;
}

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
console.log(`Invalid numbers ${invalidNum}`);
