/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const LINE_RE = /^([\w\s]+)\(contains\s([,\w\s]+)\)/;

let allergens = {};
let exclusions = [];
let allIngredients = [];

for await (const line of file.readLines()) {
    let matched = line.match(LINE_RE);
    let ing = matched[1].split(" ").filter(m => m != "");
    allIngredients.push(...ing);
    let alg = matched[2].replaceAll(" ", "").split(",");
    alg.forEach(ai => {
        if (!allergens[ai]) {
            allergens[ai] = [...ing];
        } else {
            allergens[ai] = allergens[ai].filter(a => ing.includes(a));
        }
    });
    let exclCount = exclusions.length;
    do {
        exclCount = exclusions.length;
        exclusions = Object.values(allergens).filter(v => v.length === 1).flat();
        Object.keys(allergens).filter(al => allergens[al].length > 1).forEach(al => {
            allergens[al] = allergens[al].filter(a => !exclusions.includes(a));
        })
    } while (exclCount != exclusions.length);
    console.log(`+Cycle state`);
    console.log(`Exclusions: ${JSON.stringify(exclusions)}`);
    console.log(`Allergens: ${JSON.stringify(allergens)}`);
}

allIngredients = allIngredients.filter(ing => !exclusions.includes(ing));

console.log(`++Final result`);
console.log(`Exclusions: ${JSON.stringify(exclusions)}`);
console.log(`Allergens: ${JSON.stringify(allergens)}`);
console.log(`allIngredients: ${JSON.stringify(allIngredients)}`);
console.log(`Remaining count: ${allIngredients.length}`)

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
