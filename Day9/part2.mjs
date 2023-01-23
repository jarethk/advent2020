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
let fullNumSet = [];
let invalidNum = undefined;
for await (const line of file.readLines()) {
    let lastNum = ~~line;
    if (numberSet.length >= preamble) {
        if (findMatchingPair(numberSet, lastNum).length == 0) invalidNum = lastNum;
        numberSet.shift();
    }
    numberSet.push(lastNum);
    fullNumSet.push(lastNum);
    if (invalidNum != undefined) break;
}

const t1 = performance.now();
console.log(`Invalid numbers ${invalidNum}`);

function findMatchingSet() {
    let matchingSet = [];
    for (let f = 0; f < fullNumSet.length - 1; f++) {
        let sum = fullNumSet[f];
        matchingSet = [];
        matchingSet.push(fullNumSet[f]);
        for (let f2 = f + 1; f2 < fullNumSet.length; f2++) {
            sum += fullNumSet[f2];
            matchingSet.push(fullNumSet[f2]);
            if (sum == invalidNum) return matchingSet;
            if (sum > invalidNum) break;
        }
    }
    return undefined;
}

let matchingSet = findMatchingSet();
matchingSet = matchingSet.sort((a, b) => a - b);
console.log(`${JSON.stringify(matchingSet)}`);
let first = matchingSet.shift();
let last = matchingSet.pop();

console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
console.log(`First: ${first} + last: ${last} = ${first + last}`);