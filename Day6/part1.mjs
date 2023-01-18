import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

let groupAnswers = [];
let group = new Set();
for await (const line of file.readLines()) {
    if (line === "") {
        groupAnswers.push(group.size);
        group = new Set();
    } else {
        [...line].forEach(c => { group.add(c); });
    }
}
groupAnswers.push(group.size);

console.log(groupAnswers.reduce((pv, cv) => pv + cv, 0));