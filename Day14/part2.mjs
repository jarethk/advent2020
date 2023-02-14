/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input2.txt");
const file = await open("./full-input.txt");

function mergeReg(reg, mask) {
    let newReg = []
    for (let i = 0; i < reg.length; i++) {
        if (mask[i] == '0') {
            newReg.push(reg[i]);
        } else {
            newReg.push(mask[i]);
        }
    }
    return newReg;
}

function generateMasks(base, mask) {
    if (mask.length == 0) return [base];
    let idx = mask.indexOf("X");
    if (idx != -1) {
        //dl(`found an index: ${idx}`)
        //dl(`starting base/mask: ${base.join("")}${mask.join("")}`)
        base.push(...mask.slice(0, idx));
        mask = mask.slice(idx + 1);
        //dl(`altered  base/mask: ${base.join("")}-${mask.join("")}`)
        let mask0 = generateMasks([...base, '0'], mask);
        let mask1 = generateMasks([...base, '1'], mask);
        //dl(`generated     mask: ${mask0[0].join("")}`)
        return [...mask0, ...mask1];
    } else {
        base.push(...mask);
        return [base];
    }
}

const t0 = performance.now();

let mem = {};
let mask = undefined;
let limitcounter = 0;
for await (const line of file.readLines()) {
    if (/mask\s=/.test(line)) {
        let res = line.match(/mask\s=\s([X01]+)/);
        mask = res[1];
    } else {
        let res = line.match(/mem\[(\d+)\]\s=\s(\d+)/);
        let reg = ~~res[1];
        let val = ~~res[2];
        let newreg = mergeReg([...(reg.toString(2).padStart(mask.length, '0'))], [...mask]);
        dl(`newreg 1 : ${newreg.join("")}`);
        let regset = generateMasks([], newreg);
        dl(`regset 1 : ${regset.map(r => r.join("") + '\n\t  ')}`)
        regset = regset.map(m => BigInt("0b" + m.join("")))
        dl(`regset 2 : ${regset}`)

        //let regset = maskset.map(ormask => reg | ormask);
        //dl(`regset: ${regset}`)
        regset.forEach(reg2 => {
            mem[reg2] = val;
        });
        //if (limitcounter++ > 7) {
        //    break;
        //}
    }
}

//dl(`Memory: ${JSON.stringify(mem)}`);
console.log(Object.values(mem).reduce((ac, cv) => ac + cv));
const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
//console.log(`Result = ${first[0] * first[1]} from ${earliest}`);
