//constants
const DISPLAYSIZE = localStorage.getItem('displaySize')
const CV = document.getElementById('display')
const CTX = CV.getContext('2d')
const GRAVITY = 0.5

//variables

//load
document.addEventListener('DOMContentLoaded', () => {
    if(!DISPLAYSIZE) {
        displaySize()
        console.log('ok')
    } else {
        displaySize(DISPLAYSIZE)
    }
})


//classes
class player {
    constructor(posX,posY,width,height,velocityX,velocityY,aceleration,jump=true,rEdge=false,lEdge=false,steps=0,moveLeft=true,moveRight=true) {
    this.posX = posX
    this.posY = posY
    this.width = width
    this.height = height
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.aceleration = aceleration
    this.jump = jump
    this.rEdge = rEdge
    this.lEdge = lEdge
    this.steps = this.posX
    this.moveLeft = moveLeft
    this.moveRight = moveRight
    }
    draw() {
        CTX.fillStyle = 'blue'
        CTX.fillRect(this.posX,this.posY,this.width,this.height)
    }
    update() {
        this.draw()
        this.posX += this.velocityX
        this.steps += this.velocityX
        this.posY += this.velocityY
        if (this.posY+this.height+this.velocityY <= CV.height) {
            this.velocityY += GRAVITY
        } else { 
            this.velocityY = 0
            this.jump = true
        }
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

//load images
const BGIMG = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()]
BGIMG[0].src = '../src/background/0.png'
BGIMG[1].src = '../src/background/1.png'
BGIMG[2].src = '../src/background/2.png'
BGIMG[3].src = '../src/background/3.png'
BGIMG[4].src = '../src/background/4.png'
BGIMG[5].src = '../src/background/5.png'
BGIMG[6].src = '../src/background/6.png'

const BASEIMG = [new Image(), new Image()]
BASEIMG[1].src = '../src/base/0.png'


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

//TODO:scenario
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
                if (scenario.base[x][y] != 0) PLATS.push(new object(x*16,y*16, scenario.base[x][y]))
                
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}

loadScenario();

const MEGAMAN = new player(50,80,24* DISPLAYSIZE,24* DISPLAYSIZE,0,0,1)
const PLATS = []
const BGS = []

//functions
function displaySize(s=1) {
    CTX.scale(s,s)
    CV.width="256" 
    CV.height="224"
    CV.width*=s
    CV.height*=s
    localStorage.setItem('displaySize',s)
}
const KEYS = {
    up: false,
    down: false,
    right: false,
    left: false
}
document.addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'ArrowUp':
            if(MEGAMAN.jump && MEGAMAN.velocityY==0) {
                MEGAMAN.jump = false
                KEYS.up = true
            }
            break
        case 'ArrowDown':
            MEGAMAN.jump = true
            KEYS.down = true
            break
        case 'ArrowLeft':
            MEGAMAN.moveLeft = false
            KEYS.left = true
            break
        case 'ArrowRight':
            MEGAMAN.moveRight = false
            KEYS.right = true
            break
        default:
            console.log(`no command for ${key}`)
    }
})
document.addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'ArrowUp':
            if(MEGAMAN.velocityY<=0) {
            MEGAMAN.velocityY = 0
            }
            KEYS.up = false
            break
        case 'ArrowDown':
            KEYS.down = false
            break
        case 'ArrowLeft':
            MEGAMAN.moveLeft = true
            KEYS.left = false
            break
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
    MEGAMAN.update()
    PLATS.forEach(PLAT => {
        PLAT.draw()
    })
    // console.log(MEGAMAN.steps)
    //FIXME:movement to the left
    if (MEGAMAN.steps >= 0) {
        if (KEYS.right && !KEYS.left) {
            MEGAMAN.velocityX = +3
            if(MEGAMAN.rEdge) {
                PLATS.forEach((PLAT) => {
                    MEGAMAN.velocityX = 0
                    PLAT.posX -= 3
                    MEGAMAN.steps +=3
                })
                BGS.forEach((BG) =>{
                    BG.posX -= 3
                })
            }
        } else if (KEYS.left && !KEYS.right) {
            MEGAMAN.velocityX = -3
            if(MEGAMAN.lEdge) {
                PLATS.forEach((PLAT) => {
                    MEGAMAN.velocityX = 0
                    PLAT.posX += 3
                    MEGAMAN.steps -= 3
                })
                BGS.forEach((BG) =>{
                    BG.posX += 3
                })
            }
        } else {
            MEGAMAN.velocityX = 0
        }
    } else {
        MEGAMAN.velocityX = 0
    }
    if (KEYS.up && MEGAMAN.jump) {
        MEGAMAN.velocityY = -6
        MEGAMAN.jump = false
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
                    // console.log('Hit bottom side');
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
    console.log(MEGAMAN.jump)
}
animation()

// CV.addEventListener('mousemove',mouseLog)
// function mouseLog(event){
//     console.log(event.offsetX)
//     console.log(event.offsetY)
// }
// CV.addEventListener('mousedown',testeLog)
// function testeLog() {
//     console.log(MEGAMAN.posY)
//     console.log(PLAT.posY + PLAT.height)
// }