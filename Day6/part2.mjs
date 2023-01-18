import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

let groupAnswers = [];
let group = { '-': 0 };
for await (const line of file.readLines()) {
    if (line === "") {
        let goal = group['-'];
        groupAnswers.push(Object.entries(group).filter(ent => (ent[0] != '-' && ent[1] == goal)).length);
        group = { '-': 0 };
    } else {
        group['-'] += 1;
        [...line].forEach(c => { group[c] = group[c] ? group[c] + 1 : 1; });
    }
}
groupAnswers.push(Object.entries(group).filter(ent => ent[0] != '-' && ent[1] == group['-']).length);

console.log(groupAnswers.reduce((pv, cv) => pv + cv, 0));