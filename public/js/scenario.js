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
let randomX, randomY
let randomTower = false
for (let x = 0; x <= 56; x++) {
    background[x] = {}
    if (x%5 == 0 && !randomTower) {
        randomX = Math.floor(Math.random() * ((x+5) - x + 1)) + x
        randomY = Math.floor(Math.random() * (10 - 4)) + 4
        randomTower = true
    }
    for (let y = 0; y <= 13; y++) {
    //code for tower 
        if (x == randomX) {
            if (y == randomY) {
                background[x][y] = 1
            } else if (y == randomY+1) {
                background[x][y] = 3
            } else if (y > randomY+1) {
                background[x][y] = 5
            } else {
                background[x][y] = 0
            }
        } else if (x == randomX+1) {
            randomTower = false
            if (y == randomY) {
                background[x][y] = 2
            } else if (y == randomY+1) {
                background[x][y] = 4
            } else if (y > randomY+1) {
                background[x][y] = 6
            } else {
                background[x][y] = 0
            }
        } else {
            background[x][y] = 0
        }
    }
}
for (let x = 0; x <= 56; x++) {
    base[x] = {}
    for (let y = 0; y <= 13; y++) {
        //plataform: ground
        if(y == 12) {
            base[x][y] = 1
        } else {
            base[x][y] = 0
        }
        //walls
        const WALL01 = { x: 0, y: 8, width: 3}
        const WALL02 = { x: 10, y: 10, width: 5}
        //WALL01
        for (i = 0; i < WALL01.width; i++) {
            if (x == WALL01.x + i) {
                if (y == WALL01.y) {
                    if (i == 0 ) { 
                        base[x][y] = 4
                    } else if (i > 0 &&  i + 1 < WALL01.width) {
                        base[x][y] = 5
                    } else {
                        base[x][y] = 6
                    }
                } else if (y > WALL01.y && i == 0) {
                    base[x][y] = 7
                } else if (y > WALL01.y &&  i + 1 < WALL01.width) {
                    base[x][y] = 8
                } else if (y > WALL01.y &&  i + 1 == WALL01.width) {
                    base[x][y] = 9
                }
            }
        }
        //WALL02
        for (i = 0; i < WALL02.width; i++) {
            if (x == WALL02.x + i) {
                if (y == WALL02.y) {
                    if (i == 0 ) { 
                        base[x][y] = 4
                    } else if (i > 0 &&  i + 1 < WALL02.width) {
                        base[x][y] = 5
                    } else {
                        base[x][y] = 6
                    }
                } else if (y > WALL02.y && i == 0) {
                    base[x][y] = 7
                } else if (y > WALL02.y &&  i + 1 < WALL02.width) {
                    base[x][y] = 8
                } else if (y > WALL02.y &&  i + 1 == WALL02.width) {
                    base[x][y] = 9
                }
            }
        }
    }
}
for (let x = 0; x <= 32; x++) {
    foreground[x] = {}
    for (let y = 0; y <= 28; y++) {
        foreground[x][y] = 0
    }
}
fs.writeFileSync(MAP,JSON.stringify(cache))