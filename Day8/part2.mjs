import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let commands = [];
for await (const line of file.readLines()) {
    let [ignore, op, val] = line.match(/([a-z]{3})\s(.\d+)/);
    commands.push({ op: op, val: ~~val, visits: 0 });
}

function resetVisits() {
    commands.forEach(c => { c.visits = 0; });
}

function runCommands(inst, acc, swapOp) {
    let stateStack = [];

    while (inst < commands.length && commands[inst].visits == 0) {
        dl(`current processing ${inst}: ${JSON.stringify(commands[inst])} with acc: ${acc}`);
        commands[inst].visits += 1;
        stateStack.push({ inst: inst, acc: acc });
        let op = commands[inst].op;
        if (swapOp) {
            swapOp = false;
            if (op == "jmp") op = "nop";
            else if (op == "nop") op = "jmp";
        }
        switch (op) {
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
    return stateStack;
}

let stateStack = runCommands(0, 0, false);
stateStack.some(ss => {
    if (commands[ss.inst].op == "nop" || commands[ss.inst].op == "jmp") {
        resetVisits();
        let newStack = runCommands(ss.inst, ss.acc, true);
        if (newStack[newStack.length - 1].inst == commands.length - 1) {
            stateStack = newStack
            return true;
        }
    }
    return false;
});

console.log(`accumulator: ${stateStack[stateStack.length - 1].acc}`);