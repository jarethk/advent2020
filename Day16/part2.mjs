/* eslint-disable no-unused-vars */
import { next } from 'lodash-es';
import { open } from 'node:fs/promises';
import { inRange } from 'lodash-es';


const debug = 1;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input2.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

let rules = [];
let myTicket = undefined;
let nearbyTickets = [];

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
            myTicket = line.split(",").map(v => ~~v);
            rules.forEach(r => {
                r.fields = new Array(myTicket.length).fill(true);
            });
        } else {
            nearbyTickets.push(line.split(",").map(v => ~~v));
        }
    }
}

// find the tickets that are valid, remembering from day 1 that some are not
let vt = nearbyTickets.filter(ticket =>
    ticket.every(v =>
        rules.some(r => { return (inRange(v, r.r1min, r.r1max) || inRange(v, r.r2min, r.r2max)) })
    )
);
dl(`valid tickets: ${vt.length}`)

// use the valid tickets to pre-filter the rules, for each rule updating the fields it applies to, creating a kind-of matching grid
vt.forEach(ticket => {
    ticket.forEach((v, idx) => {
        rules.forEach(r => {
            if (!inRange(v, r.r1min, r.r1max) && !inRange(v, r.r2min, r.r2max)) {
                r.fields[idx] = false;
            }
        });
    });
});

// now clean up the match grids
let changes = true;
let fieldRuleIdx = new Array(myTicket.length);
while (changes) {
    changes = false;
    rules.forEach((r, ridx) => {
        if (r.fields.map(f => f ? 1 : 0).reduce((ac, cv) => ac + cv) == 1) {
            r.fields.forEach((f, fidx) => {
                if (f && fieldRuleIdx[fidx] == undefined) {
                    fieldRuleIdx[fidx] = ridx;
                    changes = true;
                    rules.forEach(r2 => r2.fields[fidx] = false);
                }
            })
        }
    })
}

dl(rules.map(r => JSON.stringify(r)).join("\n"));
dl(fieldRuleIdx)

let departures = 1;
fieldRuleIdx.forEach((ridx, fidx) => {
    if (rules[ridx].label.startsWith('departure')) {
        departures *= myTicket[fidx];
    }
});

console.log(`departures: ${departures}`)

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
