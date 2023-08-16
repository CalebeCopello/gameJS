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
    constructor(posX,posY,width,height,velocityX,velocityY,aceleration,jump=false) {
    this.posX = posX
    this.posY = posY
    this.width = width
    this.height = height
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.aceleration = aceleration
    this.jump = jump
    }
    draw() {
        CTX.fillStyle = 'blue'
        CTX.fillRect(this.posX,this.posY,this.width,this.height)
        console.log(this.velocityY)
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

const MEGAMAN = new player(50,50,24,24,0,0,1)
const RECT = new object(160,180,48,16)

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
            moveJump(-7)
            break
        case 'ArrowDown':
            console.log('down')
            break
        case 'ArrowLeft':
            moveLeft(-3)
            console.log('down')
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
            break
        default:
            console.log(`no command for ${key}`)
    }
})

function moveLeft (n) {
    MEGAMAN.velocityX = n
}

function moveRight (n) {
    MEGAMAN.velocityX = n
}

function moveJump(n) {
    if(!MEGAMAN.jump) {
    MEGAMAN.velocityY = n
    MEGAMAN.jump = true
    }
}

//animation
function animation() {
    requestAnimationFrame(animation)
    CTX.clearRect(0,0,CV.width,CV.height)
    MEGAMAN.update()
    RECT.draw()
}
animation()