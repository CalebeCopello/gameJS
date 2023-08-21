//constants
const DISPLAYSIZE = localStorage.getItem('displaySize')
const CV = document.getElementById('display')
const CTX = CV.getContext('2d')
const GRAVITY = 0.5

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
    constructor(posX,posY,width,height,velocityX,velocityY,aceleration,jump=false,rEdge=false,lEdge=false) {
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
    }
    draw() {
        CTX.fillStyle = 'blue'
        CTX.fillRect(this.posX,this.posY,this.width,this.height)
    }
    update() {
        this.draw()
        this.posX += this.velocityX
        this.posY += this.velocityY
        if (this.posY+this.height+this.velocityY <=CV.height) {
            this.velocityY += GRAVITY
        } else { 
            this.velocityY = 0
            this.jump = false
        }
        if (this.posX >= 256 - this.width ) {
            this.velocityX = 0
            this.rEdge = true
            console.log('next scene')
        } else {
            this.rEdge = false
        }
        if (this.posX <= 0 ) {
            this.velocityX = 0
            this.lEdge = true
        } else {
            this.lEdge = false
        }
    }
}

class object {
    constructor(posX,posY,width,height,damage=false) {
        this.posX = posX
        this.posY = posY
        this.width = width
        this.height = height
        this.damage = damage
    }
    draw() {
        CTX.fillStyle='green'
        CTX.fillRect(this.posX,this.posY,this.width,this.height)
    }
}

const MEGAMAN = new player(50,190,24,24,0,0,1)
const PLAT = new object(160,150,48,16)

//functions
function displaySize(s=1) {
    CTX.scale(s,s)
    CV.width="256" 
    CV.height="224"
    CV.width*=s
    CV.height*=s
    localStorage.setItem('displaySize',s)
    MEGAMAN.draw()
}

//player movement
document.addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'ArrowUp':
            moveJump(-10)
            break
        case 'ArrowDown':
            console.log('down')
            break
        case 'ArrowLeft':
            moveLeft(-3)
            break
        case 'ArrowRight':
                moveRight(+3)            
            break
        default:
            console.log(`no command for ${key}`)
    }
})
document.addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'ArrowUp':
            moveJump(0)
            break
        case 'ArrowDown':
            break
        case 'ArrowLeft':
            moveLeft(0)
            break
        case 'ArrowRight':
            moveRight(0)
            MEGAMAN.rEdge = false
            break
        default:
            console.log(`no command for ${key}`)
    }
})

function moveLeft (n) {
    if(!MEGAMAN.lEdge) {
        MEGAMAN.velocityX = n
    }
}

function moveRight (n) {
    if(!MEGAMAN.rEdge) {
        MEGAMAN.velocityX = n
    }
}

function moveJump(n) {
    if(!MEGAMAN.jump) {
        MEGAMAN.velocityY = n
        MEGAMAN.jump = true
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
        console.log('scenario'+scenario.background[0][0]);
    }
    catch (error) {
        console.log(error);
    }
}

// loadScenario();


//animation
function animation() {
    requestAnimationFrame(animation)
    CTX.clearRect(0,0,CV.width,CV.height)
    MEGAMAN.update()
    PLAT.draw()
    //collision
    if (MEGAMAN.posY <= PLAT.posY + PLAT.height && MEGAMAN.posY + MEGAMAN.velocityY >= PLAT.posY &&  MEGAMAN.posX + MEGAMAN.width >= PLAT.posX && MEGAMAN.posX <= PLAT.posX+PLAT.width) {
        MEGAMAN.velocityY = 5
    } 
    if (MEGAMAN.posY + MEGAMAN.height <= PLAT.posY && MEGAMAN.posY + MEGAMAN.height + MEGAMAN.velocityY >= PLAT.posY && MEGAMAN.posX + MEGAMAN.width >= PLAT.posX && MEGAMAN.posX <= PLAT.posX+PLAT.width) {
        MEGAMAN.velocityY = 0
        MEGAMAN.jump = false
    }
}
animation()

CV.addEventListener('mousemove',mouseLog)
function mouseLog(event){
    console.log(event.offsetX)
    console.log(event.offsetY)
}
// CV.addEventListener('mousedown',testeLog)
// function testeLog() {
//     console.log(MEGAMAN.posY)
//     console.log(PLAT.posY + PLAT.height)
// }