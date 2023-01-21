import { open } from 'node:fs/promises';

const debug = 1;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const findColor = "shiny gold";
let colorMap = {};
for await (const line of file.readLines()) {
    let split1 = line.split(" bags contain ");
    let containerColor = split1[0];
    if (!colorMap[containerColor]) colorMap[containerColor] = { size: 0, contains: {} };
    let cm = colorMap[containerColor];
    let match = split1[1].match(/\d+\s[^,]+\sbag/g);
    if (match) {
        match.forEach(m => {
            let countColor = /(\d+)\s(.+)\sbag/.exec(m);
            cm.size += ~~countColor[1];
            cm.contains[countColor[2]] = ~~countColor[1];
        });
    }
}

//let queue = Object.keys(colorMap);
let queue = [];
queue.push(findColor);
let processed = new Set();
let cycles = 0;
while (queue.length > 0) {
    let containerColor = queue.pop();
    let cm = colorMap[containerColor];
    if (containerColor == findColor) dl(`Processing for ${containerColor}`)
    let requeued = false;
    Object.keys(cm.contains).forEach(c => {
        if (!processed.has(c)) {
            if (!requeued) queue.push(containerColor);
            queue.push(c);
            requeued = true;
        }
    });
    // if we didn't requeue this entry, then all of its contents must have already been processed, so process this one too
    if (!requeued) {
        let keys = Object.keys(cm.contains);
        // cm.contains says how many of the bags we contain
        // colorMap[c].size says how many things they contain
        // need to do a +1 on size to count the contained bag itself
        if (keys.length > 0) cm.size = keys.map(c => (cm.contains[c] * (colorMap[c].size + 1))).reduce((ac, cv) => ac + cv, 0);
        else cm.size = 0;
        processed.add(containerColor);
    }
}

dl(JSON.stringify(colorMap));
dl(`--------------`)
dl(JSON.stringify(colorMap[findColor]));
dl(JSON.stringify(colorMap["vibrant plum"]));

//let totalBags = Object.values(colorMap[findColor]).reduce((ac, cv) => ac + cv, 0);
let totalBags = colorMap[findColor].size;
const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds for ${cycles} cycles.`);

console.log(`Total bags ${totalBags}`);
