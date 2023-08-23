const fs = require('fs')
const SCR_DIR = '../src/'
const MAP = SCR_DIR+'default.json'

//creating background
let background = {}
let base = {}
let foreground = {}
let cache = {
    background: background,
    base: base,
    foreground: foreground
}
for (let x = 0; x <= 15; x++) {
    background[x] = {}
    for (let y = 0; y <= 13; y++) {
        background[x][y] = 0
    }
}
for (let x = 0; x <= 15; x++) {
    base[x] = {}
    for (let y = 0; y <= 13; y++) {
        base[x][y] = y == 13 ? 1 : 0
    }
}
for (let x = 0; x <= 32; x++) {
    foreground[x] = {}
    for (let y = 0; y <= 28; y++) {
        foreground[x][y] = 0
    }
}
fs.writeFileSync(MAP,JSON.stringify(cache))