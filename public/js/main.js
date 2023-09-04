//constants
const DISPLAYSIZE = localStorage.getItem('displaySize')
const CV = document.getElementById('display')
const CTX = CV.getContext('2d')
const GRAVITY = 0.5
const VELOCITYX = 2
const VELOCITYY = 7
const KEYS = {
    up: false,
    down: false,
    right: false,
    left: false
}

//variables
let timer
let MEGAMANIMG
let BGIMG
let BASEIMG 
let MEGAMAN
let PLATS
let BGS

//load
document.addEventListener('DOMContentLoaded', () => {
    if(!DISPLAYSIZE) {
        displaySize()
        console.log('ok')
    } else {
        displaySize(DISPLAYSIZE)
    }
})

//initGame
function initGame() {
    //Keys
    KEYS.up = false
    KEYS.down = false
    KEYS.right =  false
    KEYS.left = false
    //IMGS
    MEGAMANIMG = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()]
    MEGAMANIMG[0].src = '../src/player/s0.png'
    MEGAMANIMG[1].src = '../src/player/s1.png'
    MEGAMANIMG[2].src = '../src/player/r0.png'
    MEGAMANIMG[3].src = '../src/player/r1.png'
    MEGAMANIMG[4].src = '../src/player/j0.png'
    MEGAMANIMG[5].src = '../src/player/j1.png'

    BGIMG = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()]
    BGIMG[0].src = '../src/background/0.png'
    BGIMG[1].src = '../src/background/1.png'
    BGIMG[2].src = '../src/background/2.png'
    BGIMG[3].src = '../src/background/3.png'
    BGIMG[4].src = '../src/background/4.png'
    BGIMG[5].src = '../src/background/5.png'
    BGIMG[6].src = '../src/background/6.png'

    BASEIMG = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()]
    BASEIMG[0].src = '../src/base/0.png'
    BASEIMG[1].src = '../src/base/1.png'
    BASEIMG[2].src = '../src/base/2.png'
    BASEIMG[3].src = '../src/base/3.png'
    BASEIMG[4].src = '../src/base/4.png'
    BASEIMG[5].src = '../src/base/5.png'
    BASEIMG[6].src = '../src/base/6.png'
    BASEIMG[7].src = '../src/base/7.png'
    BASEIMG[8].src = '../src/base/8.png'
    MEGAMAN = new player(90,80,24,24,0,0,1)
    PLATS = []
    BGS = []
}
//classes
class player {
    constructor(posX,posY) {
    this.posX = posX
    this.posY = posY
    this.width = 23
    this.height = 23
    this.velocityX = 0
    this.velocityY = 0
    this.aceleration = 1
    this.jump = false
    this.rEdge = false
    this.lEdge = false
    this.steps = this.posX
    this.moveRight = true
    this.moveLeft = false
    this.image = MEGAMANIMG[0]
    this.frames = 0
    this.framesCycle = 0
    this.frameSizeX = 21
    this.frameSizeY = 24
    }
    draw() {
        // CTX.fillStyle = 'blue'
        // CTX.fillRect(this.posX,this.posY,this.width,this.height)
        CTX.drawImage(this.image,21*this.frames,0,this.frameSizeX,this.frameSizeY,this.posX,this.posY,this.width,this.height)
    }
    update() {
        if(this.moveRight) {
            this.image = MEGAMANIMG[0]
        } else {
            this.image = MEGAMANIMG[1]
        }
        this.draw()
        this.posX += this.velocityX
        this.steps += this.velocityX
        this.posY += this.velocityY
        if (this.posY+this.height+this.velocityY <= CV.height) {
            this.velocityY += GRAVITY
        } else {
            console.log('You lose!')
            initGame()
            loadScenario();
        }
        // else { 
        //     this.velocityY = 0
        // }
        if (this.posX >= 200 - this.width) {
            this.rEdge = true
        } else {
            this.rEdge = false
        }
        if (this.posX <= 36) {
            this.lEdge = true
        } else {
            this.lEdge = false
        }
    }
}

class background {
    constructor(posX,posY,code) {
        this.posX = posX
        this.posY = posY
        this.code = code
    }
    draw() {
            CTX.drawImage(BGIMG[this.code],this.posX,this.posY)
    }
}

class object {
    constructor(posX,posY,code,width,height,damage=false) {
        this.posX = posX
        this.posY = posY
        this.code = code
        this.damage = damage
        this.width = 16
        this.height = 16
    }
    draw() {
        CTX.drawImage(BASEIMG[this.code],this.posX,this.posY)
    }
}

initGame()

async function loadScenario() {
    try { 
        const data = await fetch('../src/default.json');
        if (!data.ok) {
            throw new Error('Network response was not ok');
        }
        const scenario = await data.json();
        for (x = 0; x < Object.keys(scenario.background).length; x++) {
            for (y = 0; y < Object.keys(scenario.background[x]).length; y++) {
                BGS.push(new background(x*16,y*16, scenario.background[x][y]))
            }
        }
        for (x = 0; x < Object.keys(scenario.base).length; x++) {
            for (y = 0; y < Object.keys(scenario.base[x]).length; y++) {
                if (scenario.base[x][y] != 0) PLATS.push(new object(x*16,y*16, scenario.base[x][y] -1))
                
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

loadScenario();


//functions
function displaySize(s=1) {
    CTX.scale(s,s)
    CV.width="256" 
    CV.height="224"
    CV.width*=s
    CV.height*=s
    localStorage.setItem('displaySize',s)
}
document.addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'w':
        case ' ':
        case 'ArrowUp':
            if(MEGAMAN.jump && MEGAMAN.velocityY == 0 && !KEYS.up) {
                MEGAMAN.velocityY = -(VELOCITYY)
                MEGAMAN.jump = false
                KEYS.up = true
            }
            break
        case 's':
        case 'ArrowDown':
            MEGAMAN.jump = true
            KEYS.down = true
            break
        case 'a':
        case 'ArrowLeft':
            MEGAMAN.moveLeft = true
            MEGAMAN.moveRight = false
            KEYS.left = true
            break
        case 'd':
        case 'ArrowRight':
            MEGAMAN.moveRight = true
            MEGAMAN.moveLeft = false
            KEYS.right = true
            break
        default:
            console.log(`no command for ${key}`)
    }
})
document.addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'w':
        case ' ':
        case 'ArrowUp':
            if(MEGAMAN.velocityY<=0) {
            MEGAMAN.velocityY = 0
            }
            KEYS.up = false
            break
        case 's':
        case 'ArrowDown':
            KEYS.down = false
            break
        case 'a':
        case 'ArrowLeft':
            MEGAMAN.moveLeft = true
            KEYS.left = false
            break
        case 'd':
        case 'ArrowRight':
            MEGAMAN.moveRight = true
            KEYS.right = false
            break
        default:
            console.log(`no command for ${key}`)
    }
})

//animation
function animation() {
    requestAnimationFrame(animation)
    CTX.clearRect(0,0,CV.width,CV.height)
    BGS.forEach(BG =>{
        BG.draw()
    })
    PLATS.forEach(PLAT => {
        PLAT.draw()
    })
    MEGAMAN.update()
    // console.log(MEGAMAN.steps)
    if (MEGAMAN.steps >= 0) {
        if (KEYS.right && !KEYS.left) {
            MEGAMAN.velocityX = +(VELOCITYX)
            if(MEGAMAN.rEdge) {
                PLATS.forEach((PLAT) => {
                    MEGAMAN.velocityX = 0
                    PLAT.posX -= (VELOCITYX)
                    MEGAMAN.steps += (VELOCITYX)
                })
                BGS.forEach((BG) =>{
                    BG.posX -= (VELOCITYX) - 1
                })
            }
        } else if (KEYS.left && !KEYS.right) {
            MEGAMAN.velocityX = -(VELOCITYX)
            if(MEGAMAN.lEdge) {
                PLATS.forEach((PLAT) => {
                    MEGAMAN.velocityX = 0
                    PLAT.posX += (VELOCITYX)
                    MEGAMAN.steps -= (VELOCITYX)
                })
                BGS.forEach((BG) =>{
                    BG.posX += (VELOCITYX) -1
                })
            }
        } else {
            MEGAMAN.velocityX = 0
        }
    } else {
        MEGAMAN.velocityX = 0
    }
    //collision
    PLATS.forEach((PLAT) => {
            if (
                MEGAMAN.posX + MEGAMAN.width >= PLAT.posX &&
                MEGAMAN.posX <= PLAT.posX + PLAT.width &&
                MEGAMAN.posY + MEGAMAN.height + MEGAMAN.velocityY >= PLAT.posY &&
                MEGAMAN.posY + MEGAMAN.velocityY <= PLAT.posY + PLAT.height
            ) {
            // Check collision side
            const overlapX = Math.min(MEGAMAN.posX + MEGAMAN.width, PLAT.posX + PLAT.width) - Math.max(MEGAMAN.posX, PLAT.posX);
            const overlapY = Math.min(MEGAMAN.posY + MEGAMAN.height , PLAT.posY + PLAT.height) - Math.max(MEGAMAN.posY, PLAT.posY);
            if (overlapX > overlapY) {
                if (MEGAMAN.posY < PLAT.posY) {
                    MEGAMAN.velocityY = 0
                    MEGAMAN.jump = true
                } else {
                    //console.log('Hit top side')
                    MEGAMAN.posY = PLAT.posY + PLAT.height
                    MEGAMAN.velocityY = 0
                }
            } else {
                if (MEGAMAN.posX < PLAT.posX) {
                    // console.log('Hit right side');
                    MEGAMAN.velocityX = -1
                } else {
                    // console.log('Hit left side');
                    MEGAMAN.velocityX = +1
                }
            }
        }
    })
}
animation()