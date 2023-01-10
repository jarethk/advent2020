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
    let firstMatch = v.pass.charAt(v.min - 1) == v.chr;
    let secondMatch = v.pass.charAt(v.max - 1) == v.chr;
    if ((firstMatch || secondMatch) && !(firstMatch && secondMatch)) validCount++;
});

console.log(`valid count: ${validCount}`);