import { open } from 'node:fs/promises';

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const passRE = /(\w{3}\:[^\s]+)/g;
let passList = [];
let passport = [];

for await (const line of file.readLines()) {
    if (line === "") {
        passList.push(passport.sort().map(p => p.split(":")));
        passport = [];
    } else {
        let res = line.match(passRE);
        passport.push(...res);
    }
}
passList.push(passport.sort().map(p => p.split(":")));

let validCount = 0;

passList.forEach(p => {
    if (p.length == 8) {
        if (p[0][0] === "byr" &&
            p[1][0] === "cid" &&
            p[2][0] === "ecl" &&
            p[3][0] === "eyr" &&
            p[4][0] === "hcl" &&
            p[5][0] === "hgt" &&
            p[6][0] === "iyr" &&
            p[7][0] === "pid") validCount++;
    } else if (p.length == 7) {
        if (p[0][0] === "byr" &&
            p[1][0] === "ecl" &&
            p[2][0] === "eyr" &&
            p[3][0] === "hcl" &&
            p[4][0] === "hgt" &&
            p[5][0] === "iyr" &&
            p[6][0] === "pid") validCount++;
    }
});

console.log(`Valid count: ${validCount}`);