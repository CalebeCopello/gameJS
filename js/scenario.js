const fs = require('fs')
const SCR_DIR = '../src/'
const MAP = SCR_DIR+'default.json'

//creating background
let backgroundCache = { background: {}}
for (let i = 0; i <= 32; i++) {
    backgroundCache.background[i] = {}
    for (let j = 0; j <= 28; j++) {
        backgroundCache.background[i][j] = j == 28 ? 1 : 0
    }
}
fs.writeFileSync(MAP,JSON.stringify(backgroundCache))