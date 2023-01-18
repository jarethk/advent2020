import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

let colorMap = {};
for await (const line of file.readLines()) {
    let split1 = line.split(" bags contain ");
    let containerColor = split1[0];
    if (!colorMap[containerColor]) colorMap[containerColor] = {};
    let match = split1[1].match(/\d+\s[^,]+\sbag/g);
    if (match) {
        match.forEach(m => {
            let countColor = /(\d+)\s(.+)\sbag/.exec(m);
            colorMap[containerColor][countColor[2]] = countColor[1];
        });
    }
}

let queue = Object.keys(colorMap);

while (queue.length > 0) {
    let containerColor = queue.shift();
    let colors = Object.keys(colorMap[containerColor]);
    let updated = false;
    colors.forEach(c => {
        let subColors = Object.keys(colorMap[c]);
        subColors.forEach(subc => {
            if (!colorMap[containerColor][subc]) {
                colorMap[containerColor][subc] = colorMap[containerColor][c] * colorMap[c][subc];
                updated = true;
            }
        });
    });
    dl(`Updated color map ${containerColor}`);
    if (updated) queue.push(containerColor);
}

dl(JSON.stringify(colorMap));

const findColor = "shiny gold";
let foundCount = Object.keys(colorMap).filter(c => colorMap[c][findColor] != undefined).length;

console.log(`Found count ${foundCount}`);
