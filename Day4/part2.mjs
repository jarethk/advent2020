import { open } from 'node:fs/promises';

//const file = await open("./sample-input.txt");
//const file = await open("./valid-sample.txt");
//const file = await open("./invalid-sample.txt");
const file = await open("./full-input.txt");

const passRE = /(\w{3}\:[^\s]+)/g;
let byrRE = /^(19[2-9][0-9])|(200[0-2])$/;
let iyrRE = /^(201[0-9])|(2020)$/;
let eyrRE = /^(202[0-9])|(2030)$/;
let hgtRE = /^(1[5-8][0-9]cm)|(19[0-3]cm)|(59in)|(6[0-9]in)|(7[0-6]in)$/;
let hclRE = /^(\#[0-9a-f]{6})$/;
let eclRE = /^(amb)|(blu)|(brn)|(gry)|(grn)|(hzl)|(oth)$/;
let pidRE = /^([0-9]{9})$/;

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
            p[7][0] === "pid") {
            if (byrRE.test(p[0][1]) &&
                eclRE.test(p[2][1]) &&
                eyrRE.test(p[3][1]) &&
                hclRE.test(p[4][1]) &&
                hgtRE.test(p[5][1]) &&
                iyrRE.test(p[6][1]) &&
                pidRE.test(p[7][1])) {
                validCount++;

            } else {
                console.log(`--Invalid passport: ${JSON.stringify(p)}`);
                if (!byrRE.test(p[0][1])) console.log(`Validate byr: ${p[0][1]}: ${byrRE.test(p[0][1])}`);
                if (!eclRE.test(p[2][1])) console.log(`Validate ecl: ${p[2][1]}: ${eclRE.test(p[2][1])}`);
                if (!eyrRE.test(p[3][1])) console.log(`Validate eyr: ${p[3][1]}: ${eyrRE.test(p[3][1])}`);
                if (!hclRE.test(p[4][1])) console.log(`Validate hcl: ${p[4][1]}: ${hclRE.test(p[4][1])}`);
                if (!hgtRE.test(p[5][1])) console.log(`Validate hgt: ${p[5][1]}: ${hgtRE.test(p[5][1])}`);
                if (!iyrRE.test(p[6][1])) console.log(`Validate iyr: ${p[6][1]}: ${iyrRE.test(p[6][1])}`);
                if (!pidRE.test(p[7][1])) console.log(`Validate pid: ${p[7][1]}: ${pidRE.test(p[7][1])}`);
            }
        }
    } else if (p.length == 7) {
        if (p[0][0] === "byr" &&
            p[1][0] === "ecl" &&
            p[2][0] === "eyr" &&
            p[3][0] === "hcl" &&
            p[4][0] === "hgt" &&
            p[5][0] === "iyr" &&
            p[6][0] === "pid") {
            if (byrRE.test(p[0][1]) &&
                eclRE.test(p[1][1]) &&
                eyrRE.test(p[2][1]) &&
                hclRE.test(p[3][1]) &&
                hgtRE.test(p[4][1]) &&
                iyrRE.test(p[5][1]) &&
                pidRE.test(p[6][1])) {
                validCount++;
            } else {
                console.log(`--Invalid passport: ${JSON.stringify(p)}`);
                if (!byrRE.test(p[0][1])) console.log(`Validate byr: ${p[0][1]}: ${byrRE.test(p[0][1])}`);
                if (!eclRE.test(p[1][1])) console.log(`Validate ecl: ${p[1][1]}: ${eclRE.test(p[1][1])}`);
                if (!eyrRE.test(p[2][1])) console.log(`Validate eyr: ${p[2][1]}: ${eyrRE.test(p[2][1])}`);
                if (!hclRE.test(p[3][1])) console.log(`Validate hcl: ${p[3][1]}: ${hclRE.test(p[3][1])}`);
                if (!hgtRE.test(p[4][1])) console.log(`Validate hgt: ${p[4][1]}: ${hgtRE.test(p[4][1])}`);
                if (!iyrRE.test(p[5][1])) console.log(`Validate iyr: ${p[5][1]}: ${iyrRE.test(p[5][1])}`);
                if (!pidRE.test(p[6][1])) console.log(`Validate pid: ${p[6][1]}: ${pidRE.test(p[6][1])}`);
            }
        }
    }
});

console.log(`Valid count: ${validCount}`);