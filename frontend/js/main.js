//constants
const CV = document.getElementById('display')
const CTX = CV.getContext('2d')
const GRAVITY = 0.5
const DISPLAYSIZE = 2

//variables
let PLAYERIMG = []
let PLAYER


//set display propierties
CV.width = 256*DISPLAYSIZE
CV.height = 224*DISPLAYSIZE
CV.style.backgroundColor = 'rgb(255,255,255)'
CTX.imageSmoothingEnabled = false;

//function to set sprites
function setPlayerSprites() {
    PLAYERIMG = [new Image()]
    PLAYERIMG[0].src = '/src/player/small/sm01.png'
}

function initGame() {
    PLAYER = new player (1*DISPLAYSIZE,150*DISPLAYSIZE)
}

//player set
class player {
    constructor(posX,posY) {
        this.posX = posX
        this.posY = posY
        this.image = PLAYERIMG[0]
    }
    draw() {
        CTX.drawImage(this.image,this.posX,this.posY,16*2,16*2)
    }
    update() {
    this.draw()
    }
}

function animation() {
    requestAnimationFrame(animation)
    PLAYER.update()
}
setPlayerSprites()
initGame()
animation()