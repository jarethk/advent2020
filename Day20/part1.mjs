/* eslint-disable no-unused-vars */
import { open } from 'node:fs/promises';

const debug = 0;
const dl = log => { if (debug) console.log(log); };

//const file = await open("./sample-input.txt");
const file = await open("./full-input.txt");

const t0 = performance.now();

const TOP = 0
const RIGHT = 1
const BOTTOM = 2
const LEFT = 3

let tid = 0;

/**
 * Flip the 2D frame on the Y dimension, left becomes right, top and bottom are reversed, and right becomes left.
 * 
 * @param {*} frame 
 * @returns 
 */
function flipFrameY(frame) {
    return {
        tile: frame.tile,
        tid: tid++,
        top: frame.top.split("").reverse().join(""),
        bottom: frame.bottom.split("").reverse().join(""),
        left: frame.right,
        right: frame.left,
        matches: []
    };
}

/**
 * Flip the 2D frame on the X dimension, top becomes bottom, left and right are reversed, and bottom becomes top.
 * 
 * @param {*} frame 
 * @returns 
 */
function flipFrameX(frame) {
    return {
        tile: frame.tile,
        tid: tid++,
        top: frame.bottom,
        bottom: frame.top,
        left: frame.left.split("").reverse().join(""),
        right: frame.right.split("").reverse().join(""),
        matches: []
    };
}


/**
 * Rotate the 2D frame by degrees, 90, 180, or 270
 * @param {*} frame 
 * @param {*} rotation 
 */
function rotateFrame(frame, rotation) {
    if (rotation > 90) {
        frame = rotateFrame(frame, rotation - 90);
    }
    return {
        tile: frame.tile,
        tid: tid++,
        top: frame.left.split("").reverse().join(""),
        bottom: frame.right.split("").reverse().join(""),
        left: frame.bottom,
        right: frame.top,
        matches: []
    };
}

const TILE_LINE_RE = /Tile (\d+):/;
let tiles = [];
let currentTile;

for await (const line of file.readLines()) {
    if (TILE_LINE_RE.test(line)) {
        let parts = line.match(TILE_LINE_RE);
        currentTile = { num: ~~parts[1], initial: [] };
        tiles.push(currentTile);
    } else if (line != "") {
        currentTile.initial.push(line.split(""));
    }
}

// now we need to see where each tile maps to others...
// for each tile, pre-calc the rotations and save in the tile object
// if this is not the first tile, check against the prior tiles
// if current.right matches prior.left, and current.bottom matches other prior.top, then is candidate for top-left corner
// then we can use these candidates as potential starts for searching map options
for (let t = 0; t < tiles.length; t++) {
    let current = tiles[t];
    // r1 is normal orientation
    current.rotations = [{
        tile: current.num,
        tid: tid++,
        top: current.initial[0].join(""),
        bottom: current.initial[current.initial.length - 1].join(""),
        left: current.initial.map(r => r[0]).join(""),
        right: current.initial.map(r => r[r.length - 1]).join(""),
        matches: []
    }];
    current.rotations.push(flipFrameX(current.rotations[0])); //1
    current.rotations.push(rotateFrame(current.rotations[0], 90)); //2
    current.rotations.push(flipFrameX(current.rotations[2])); //3
    current.rotations.push(rotateFrame(current.rotations[2], 90)); //4
    current.rotations.push(flipFrameX(current.rotations[4])); //5
    current.rotations.push(rotateFrame(current.rotations[4], 90)); //6
    current.rotations.push(flipFrameX(current.rotations[6])); //7

    // go through each of the previous tiles
    // for each of the current rotation/flip options
    // check each of the prior tile rotation/flip options for alignment
    // and keep a list of matches
    for (let p = 0; p < t; p++) {
        let pt = tiles[p];
        for (let cr = 0; cr < current.rotations.length; cr++) {
            for (let pr = 0; pr < pt.rotations.length; pr++) {
                if (current.rotations[cr].top === pt.rotations[pr].bottom) {
                    current.rotations[cr].matches.push({ dir: "N", next: pt.rotations[pr] });
                    pt.rotations[pr].matches.push({ dir: "S", next: current.rotations[cr] });
                }
                if (current.rotations[cr].bottom === pt.rotations[pr].top) {
                    current.rotations[cr].matches.push({ dir: "S", next: pt.rotations[pr] });
                    pt.rotations[pr].matches.push({ dir: "N", next: current.rotations[cr] });
                }
                if (current.rotations[cr].left === pt.rotations[pr].right) {
                    current.rotations[cr].matches.push({ dir: "W", next: pt.rotations[pr] });
                    pt.rotations[pr].matches.push({ dir: "E", next: current.rotations[cr] });
                }
                if (current.rotations[cr].right === pt.rotations[pr].left) {
                    current.rotations[cr].matches.push({ dir: "E", next: pt.rotations[pr] });
                    pt.rotations[pr].matches.push({ dir: "W", next: current.rotations[cr] });
                }
            }
        }
    }
}

//console.log(`Rotations`)
//console.log(tiles[0].rotations.map(r => JSON.stringify(r)).join("\n"));

console.log(`tiles:`);
tiles.forEach(t => {
    let matches = t.rotations[2].matches.reduce((ac, cv) => { ac[cv.dir] != undefined ? ac[cv.dir] += 1 : ac[cv.dir] = 1; return ac; }, {});

    matches = Object.entries(matches).filter(p => p[1] != 1);
    if (matches.length > 0) {
        console.log(`\ttile: ${t.num}`);
        console.log(`\t ${JSON.stringify(Object.entries(matches).filter(p => p[1] != 1))}`);
    }

});

let corners = tiles.filter(t => t.rotations.some(r => r.matches.length == 2));
dl(`how many corners? ${corners.length}`);
let altScore = corners.map(t => t.num).reduce((ac, cv) => ac * cv, 1);

console.log(`final score: ${altScore}`)

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
