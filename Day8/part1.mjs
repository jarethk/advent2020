import { open } from 'node:fs/promises';

const debug = 1;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let commands = [];
for await (const line of file.readLines()) {
    let [ignore, op, val] = line.match(/([a-z]{3})\s(.\d+)/);
    commands.push({ op: op, val: ~~val, visits: 0 });
}

let acc = 0;
let inst = 0;

while (commands[inst].visits == 0) {
    dl(`current processing ${inst}: ${JSON.stringify(commands[inst])} with acc: ${acc}`);
    commands[inst].visits += 1;
    switch (commands[inst].op) {
        case "acc":
            acc += commands[inst].val;
            inst++;
            break;
        case "nop":
            inst++;
            break;
        case "jmp":
            inst += commands[inst].val;
            break;
        default:
            inst++;
            break;
    }
}

console.log(`accumulator: ${acc}`);