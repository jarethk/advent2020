import { open } from 'node:fs/promises';
import { multiply } from 'lodash-es';
//const performance = require("perf_hooks").performance

//let startTime = performance.now()

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const targetAmt = 2020;
let expenses = []

for await (const line of file.readLines()) {
    expenses.push(~~line);
}

console.log(`expenses: ${expenses}`);

function findMatchingPair() {
    for (let p1 = 1; p1 < expenses.length; p1++) {
        for (let p2 = 0; p2 < p1; p2++) {
            if (expenses[p1] + expenses[p2] == targetAmt) {
                return [expenses[p1], expenses[p2]];
            }
        }
    }
    return [];
}

let matchingPair = findMatchingPair();
console.log(`matching pair: ${matchingPair}`);
if (matchingPair.length > 0) {
    console.log(matchingPair.reduce(multiply, 1));
}
