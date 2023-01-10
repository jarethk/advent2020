import { open } from 'node:fs/promises';
import { inRange } from 'lodash-es';

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

let validation = []
let lineRe = /(\d+)\-(\d+)\s(.)\:\s(.+)/

for await (const line of file.readLines()) {
    let res = line.match(lineRe);
    console.log(`parsed line: ${res}`);
    validation.push({ min: ~~res[1], max: ~~res[2], chr: res[3], pass: res[4] });
}

//console.log(JSON.stringify(validation));

let validCount = 0;
validation.forEach(v => {
    let re = new RegExp(v.chr, "g");
    let res = v.pass.match(re);
    let count = (res) ? res.length : 0;
    if (inRange(count, v.min, v.max + 1)) validCount++;
    console.log(`validated pass ${JSON.stringify(v)}: ${res ? res.length : 0}; count ${validCount}`);
});

console.log(`valid count: ${validCount}`);