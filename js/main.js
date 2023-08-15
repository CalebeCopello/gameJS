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
    // MEGAMAN.draw()

})

//classes
class player {
    constructor(posX,posY,width,height,velocityX,velocityY,aceleration) {
    this.posX = posX
    this.posY = posY
    this.width = width
    this.height = height
    this.velocityX = velocityX
    this.velocityY = velocityY
    this.aceleration = aceleration
    }
    draw() {
        CTX.scale(DISPLAYSIZE,DISPLAYSIZE)
        CTX.fillStyle = 'blue'
        CTX.fillRect(this.posX,this.posY,this.width,this.height)
        // console.log(this.posX,this.posY,this.width,this.height)
    }
    update() {
        this.draw()
        this.posX += this.velocityX
        this.posY += this.velocityY
        if (this.posY+this.height+this.velocityY <=CV.height) {
            this.velocityY += GRAVITY
        } else { this.velocityY = 0}
    }
}

const MEGAMAN = new player(50,50,24,24,0,0,1)
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

//controler
document.addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'ArrowUp':
            moveJump(5)
            break
        case 'ArrowDown':
            console.log('down')
            break
        case 'ArrowLeft':
            moveLeft(5)
            console.log('down')
            break
        case 'ArrowRight':
            moveRight(5)
            break
        default:
            console.log(`no command for ${key}`)
    }
})
document.addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'ArrowUp':
            moveJump(0)
            console.log('up')
            break
        case 'ArrowDown':

            break
        case 'ArrowLeft':
            moveLeft(0)
            console.log('up')
            break
        case 'ArrowRight':
            moveRight(0)
            break
        default:
            console.log(`no command for ${key}`)
    }
})

function moveLeft (n) {
    console.log(n)
    if (n=0) {
        MEGAMAN.velocityX = 0
        console.log(MEGAMAN.velocityX)
    } else if (n = 5) {
        console.log('else')
        MEGAMAN.velocityX -= n
        console.log(MEGAMAN.velocityX)
    }
}

function moveRight (n) {
    MEGAMAN.velocityX += n
}

function moveJump(n) {
    MEGAMAN.velocityY -= n
}

//animation
function animation() {
    requestAnimationFrame(animation)
    CTX.clearRect(0,0,CV.width,CV.height)
    MEGAMAN.update()
}
animation()