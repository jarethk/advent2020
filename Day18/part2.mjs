/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

function evalOp(val, op, n) {
    if (op === "+") {
        val += n;
    } else if (op === "*") {
        val *= n;
    }
    return val;
}

function evaluateFormula(formula, opp, d) {
    let val = 0;
    let n = 0;
    let right = formula;
    let op = "+";
    while (right.length > 0) {
        n = 0;
        let c = right.shift();
        if (c === "+") {
            op = c;
            continue;
        } else if (c === ")") {
            if (opp !== "") {
                val = evalOp(val, op, n);
                right.unshift(")");
            }
            return [val, right];
        } else if (c === "(") {
            [n, right] = evaluateFormula(right, "", d + " ");
            dl(`${d}==paren eval ${val} ${op} ${n}`)
        } else if (c === "*" && opp === "") {
            op = c;
            [n, right] = evaluateFormula(right, op, d + " ");
            dl(`${d}==mult eval ${val} ${op} ${n}`)
        } else if (c === "*" && opp === "*") {
            return [val, right];
        } else {
            n = ~~c;
        }
        val = evalOp(val, op, n);
        dl(`${d}--loop end ${val}; ${right}`)
    }
    return [val, []];
}

let sum = 0;
for await (const line of file.readLines()) {
    console.log(`evaluating ${line}`);
    let res = evaluateFormula(line.split("").filter(c => c != " "), "", "");
    console.log("Solution: " + res[0]);
    sum += res[0];
}

console.log(`grand sum ${sum}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
