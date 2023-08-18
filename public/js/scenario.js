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
for (let i = 0; i <= 32; i++) {
    background[i] = {}
    for (let j = 0; j <= 28; j++) {
        background[i][j] = 1
    }
}
for (let i = 0; i <= 32; i++) {
    base[i] = {}
    for (let j = 0; j <= 28; j++) {
        base[i][j] = j == 28 ? 1 : 0
    }
}
for (let i = 0; i <= 32; i++) {
    foreground[i] = {}
    for (let j = 0; j <= 28; j++) {
        foreground[i][j] = 0
    }
}
fs.writeFileSync(MAP,JSON.stringify(cache))