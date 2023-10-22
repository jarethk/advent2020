/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 1;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

function formulaToTree(formula) {
    let tree = [];
    let right = [...formula];
    let l = "";
    while (right.length > 0) {
        let c = right.shift();
        if (c === "(") {
            [l, right] = formulaToTree(right);
            tree.push(l);
        } else if (c === ")") {
            dl(`-- returning paren tree ${JSON.stringify(tree)}; ${right}`);
            return [tree, right];
        } else {
            if (c !== "*" && c !== "+") c = ~~c;
            tree.push(c);
        }
    }
    dl(`-- returning end tree ${JSON.stringify(tree)}; ${right}`);
    return [tree, right];
}

function evaluateTree(fTree) {
    dl(`--> in evaluateTree with ${JSON.stringify(fTree)}`)
    fTree = fTree.map(t => Array.isArray(t) ? evaluateTree(t) : t);
    dl(`--> mapped to ${JSON.stringify(fTree)}`)
    for (let t = 0; t < fTree.length; t++) {
        if (fTree[t + 1] && fTree[t + 1] === "+") {
            let v = fTree[t] + fTree[t + 2];
            fTree.splice(t, 3, v);
            t--;
        }
    }
    dl(`--> after addition ${JSON.stringify(fTree)}`)
    for (let t = 0; t < fTree.length; t++) {
        if (fTree[t + 1] && fTree[t + 1] === "*") {
            let v = fTree[t] * fTree[t + 2];
            fTree.splice(t, 3, v);
            t--;
        }
    }
    return fTree[0];
}

function evaluateFormula(formula) {
    let fTree = formulaToTree(formula.split("").filter(c => c != " "));
    dl("Formula tree: " + JSON.stringify(fTree[0]));
    return evaluateTree(fTree[0]);
}

let sum = 0;
let count = 0;
for await (const line of file.readLines()) {
    console.log(`evaluating ${line}`);
    let res = evaluateFormula(line);
    console.log(`evaluated to ${res}`);
    sum += res;
    count++;
    //if (count > 1) break;
}

console.log(`grand sum ${sum}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
