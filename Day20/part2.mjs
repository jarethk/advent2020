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
        mid: frame.mid.map((row, ridx) => frame.mid[frame.mid.length - 1 - ridx]),
        full: frame.full.map((row, ridx) => frame.full[frame.full.length - 1 - ridx]),
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
        mid: frame.mid.map((row, idx) => row.map((c, cidx) => frame.mid[row.length - cidx - 1][idx])),
        full: frame.full.map((row, idx) => row.map((c, cidx) => frame.full[row.length - cidx - 1][idx])),
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
        mid: current.initial
            .filter((r, idx) => idx != 0 && idx != current.initial.length - 1)
            .map(r => r.filter((c, idx) => idx != 0 && idx != r.length - 1)),
        full: current.initial.map(r => [...r]),
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

dl('first tile mid:')
dl(tiles[0].rotations[0].mid.map(r => r.join("")).join("\n"));

dl('first tile flip:')
dl(tiles[0].rotations[1].mid.map(r => r.join("")).join("\n"));

dl('first tile rotation:')
dl(tiles[0].rotations[2].mid.map(r => r.join("")).join("\n"));

//console.log(`Rotations`)
//console.log(tiles[0].rotations.map(r => JSON.stringify(r)).join("\n"));


let gridSize = Math.sqrt(tiles.length);
console.log(`Size of grid with tiles ${tiles.length}: ${gridSize}`)
let gridEnd = gridSize - 1;

let gameBoard = new Array(gridSize);
for (let f = 0; f < gameBoard.length; f++) { gameBoard[f] = new Array(gridSize); }

//let gameImage = new Array(gridSize * tiles[0].rotations[0].mid.length);
//for (let f = 0; f < gameImage.length; f++) { gameImage[f] = new Array(gridSize * tiles[0].rotations[0].mid[0].length); }
let gameImage = new Array(gridSize);
for (let f = 0; f < gameImage.length; f++) { gameImage[f] = new Array(gridSize); }

// now need to figure out how to turn that into a map
// we work from whatever is the leading edge, always filling in to the right and down
// which creates a new edge, until we hit the end corner
// where edge is a list of pairs, of pieces and coords

function playPiece(piece, coords, playQueue) {
    gameBoard[coords[0]][coords[1]] = piece.tile;
    gameImage[coords[0]][coords[1]] = piece;
    /*
    console.log(`Placing mid at coords ${coords}\n${piece.mid.map(r => r.join("")).join("\n")}`)
    let baseY = coords[0] * piece.mid.length;
    let baseX = coords[1] * piece.mid[0].length;
    let invertY = piece.mid.length - 1;
    let invertX = piece.mid[0].length - 1;
    for (let y = 0; y < piece.mid.length; y++) {
        for (let x = 0; x < piece.mid[y].length; x++) {
            gameImage[baseY + y][baseX + x] = piece.mid[y][x];
        }
    }
    */
    playQueue.add(JSON.stringify([piece.tile, piece.tid, [...coords]]));
}

// play queue is a set of coords
function playRound2() {
    let playQueue = new Set();
    //let startPiece = corners[0].rotations[0];
    let startPiece = corners[0].rotations.find(r => r.matches.some(m => m.dir == "E") && r.matches.some(m => m.dir == "S"));
    playPiece(startPiece, [0, 0], playQueue);
    //gameBoard[0][0] = startPiece.tile;
    //playQueue.add(JSON.stringify([startPiece.tile, startPiece.tid, [0, 0]]));

    while (playQueue.size > 0) {
        let nextPlay = playQueue.values().next().value;
        playQueue.delete(nextPlay);
        let [num, tid, coords] = JSON.parse(nextPlay);
        console.log(`Playing ${nextPlay} coords ${JSON.stringify(coords)} queue length ${playQueue.size}`)
        let piece = tiles.find(t => t.num == num).rotations.find(r => r.tid == tid);

        let eCoords = [coords[0], coords[1] + 1];
        if (coords[1] < gridEnd && gameBoard[eCoords[0]][eCoords[1]] == undefined) {
            let ePiece = piece.matches.find(m => m.dir == "E").next;
            playPiece(ePiece, eCoords, playQueue);
            //gameBoard[eCoords[0]][eCoords[1]] = ePiece.tile;
            //playQueue.add(JSON.stringify([ePiece.tile, ePiece.tid, eCoords]));
        }

        let sCoords = [coords[0] + 1, coords[1]];
        if (coords[0] < gridEnd && gameBoard[sCoords[0]][sCoords[1]] == undefined) {
            let sPiece = piece.matches.find(m => m.dir == "S").next;
            playPiece(sPiece, sCoords, playQueue);
            //gameBoard[sCoords[0]][sCoords[1]] = sPiece.tile;
            //playQueue.add(JSON.stringify([sPiece.tile, sPiece.tid, sCoords]));
        }
    }
}


let corners = tiles.filter(t => t.rotations.some(r => r.matches.length == 2));
console.log(corners.length);
let altScore = corners.map(t => t.num).reduce((ac, cv) => ac * cv, 1);

playRound2();

console.log(`Game Board:\n${gameBoard.map(r => JSON.stringify(r)).join("\n")}`);

//console.log(`Game Image:\n${gameImage.map(block => block.join("")).join("\n")}`);

let compressedImage = [];
for (let br = 0; br < gameImage.length; br++) {
    let blockRow = gameImage[br];
    for (let r = 0; r < blockRow[0].mid.length; r++) {
        compressedImage.push(blockRow.map(block => block.mid[r].join("")).join(""))
    }
}

// debug print the merged mid blocks to check against the example
if (debug) {
    for (let br = 0; br < gameImage.length; br++) {
        let blockRow = gameImage[br];
        for (let r = 0; r < blockRow[0].mid.length; r++) {
            console.log(blockRow.map(block => block.mid[r].join("")).join(""))
        }
    }
}

console.log(`compressed image:\n${compressedImage.join("\n")}`);

let patternImage = [
    "                  # ",
    "#    ##    ##    ###",
    " #  #  #  #  #  #   "
].map(r => r.replaceAll(" ", ".")).map(r => new RegExp(r));
console.log(`pattern image:\n${patternImage.join("\n")}`);

let rotations = [];
rotations.push(compressedImage);
rotations.push(rotations[0].map((row, ridx) => rotations[0][rotations[0].length - 1 - ridx])); //1
rotations.push(rotations[0].map((row, idx) => row.split("").map((c, cidx) => rotations[0][row.length - cidx - 1].charAt(idx)).join(""))); //2
rotations.push(rotations[2].map((row, ridx) => rotations[2][rotations[2].length - 1 - ridx])); //3
rotations.push(rotations[2].map((row, idx) => row.split("").map((c, cidx) => rotations[2][row.length - cidx - 1].charAt(idx)).join(""))); //4
rotations.push(rotations[4].map((row, ridx) => rotations[4][rotations[4].length - 1 - ridx])); //5
rotations.push(rotations[4].map((row, idx) => row.split("").map((c, cidx) => rotations[4][row.length - cidx - 1].charAt(idx)).join(""))); //6
rotations.push(rotations[6].map((row, ridx) => rotations[6][rotations[6].length - 1 - ridx])); //7

let matchCounts = 0;
rotations.some(image => {
    let found = false;
    for (let r = 0; r < image.length - patternImage.length; r++) {
        if (patternImage[0].test(image[r])) {
            //console.log(`first test found a match at ${r}`)
            for (let m = image[r].search(patternImage[0]); m < (image[r].length - (patternImage[0].source.length)); m++) {
                if (image[r].slice(m).search(patternImage[0]) == 0
                    && image[r + 1].slice(m).search(patternImage[1]) == 0
                    && image[r + 2].slice(m).search(patternImage[2]) == 0) {
                    console.log(`found a serpent starting at row ${r}`);
                    matchCounts++;
                    found = true;
                }
            }
        }
    }
    return found;
});

// now we know how many matches there were, so remove the count of that many matches from the count of #
let serpentCount = patternImage.map(r => r.source.split("").map(c => c == "#" ? 1 : 0).reduce((ac, cv) => ac + cv)).reduce((ac, cv) => ac + cv);
console.log(`Serpent has ${serpentCount}`)

let imageCount = compressedImage.map(r => r.split("").map(c => c == "#" ? 1 : 0).reduce((ac, cv) => ac + cv)).reduce((ac, cv) => ac + cv);

console.log(`remaining: ${imageCount - (serpentCount * matchCounts)}`)

/*
console.log(`First block:`);
console.log(`  ${gameImage[0][0].top}`)
gameImage[0][0].full.forEach((r, ridx) => {
    console.log(`${gameImage[0][0].left[ridx]} ${r.join("")} ${gameImage[0][0].right[ridx]}`);
});
console.log(`  ${gameImage[0][0].bottom}`)
*/

let finalScore = gameBoard[0][0] * gameBoard[0][gridSize - 1] * gameBoard[gridSize - 1][0] * gameBoard[gridSize - 1][gridSize - 1]
console.log(`final score: ${finalScore} or ${altScore}`)

const t1 = performance.now();
console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
