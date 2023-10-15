/* eslint-disable no-unused-vars */
import { next } from 'lodash-es';
import { open } from 'node:fs/promises';
import { inRange } from 'lodash-es';


const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let rules = [];
let myTicket = undefined;
let nearbyTickets = [];
let errorRate = 0;

const RULE_RE = /^(.+): ([\d]+)-([\d]+) or ([\d]+)-([\d]+)$/;
const TICKET_RE = /^(\d+,?)+$/

for await (const line of file.readLines()) {
    dl(`parsing line ${line}`)
    if (RULE_RE.test(line)) {
        dl(`attempting to parse rule ${line}`)
        let match = line.match(RULE_RE);
        rules.push({ label: match[1], r1min: ~~match[2], r1max: ~~match[3] + 1, r2min: ~~match[4], r2max: ~~match[5] + 1 });
        dl(`parsed rule ${JSON.stringify(rules[rules.length - 1])}`)
    } else if (TICKET_RE.test(line)) {
        if (myTicket === undefined) {
            myTicket = line.split(",");
        } else {
            let match = line.split(",").map(v => ~~v).some(v => {
                dl(`--testing value ${v}`)
                if (!rules.some(r => {
                    let pass1 = inRange(v, r.r1min, r.r1max);
                    let pass2 = inRange(v, r.r2min, r.r2max);
                    if (!pass1 && !pass2) {
                        dl(`==rule validation failed for ${line}, value ${v}, r ${r.label}; ${pass1} ${pass2}`);
                    }
                    return pass1 || pass2;
                })) {
                    console.log(`value found invalid: ${v}`);
                    errorRate += v;
                }
            });
        }
    }
}

console.log(`Final error rate ${errorRate}`);

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
