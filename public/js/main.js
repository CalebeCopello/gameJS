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
    constructor(posX,posY,width,height,velocityX,velocityY,aceleration,jump=false,rEdge=false,lEdge=false,steps=0,moveLeft=true,moveRight=true) {
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
        if (this.posY+this.height+this.velocityY <=CV.height) {
            this.velocityY += GRAVITY
        } else { 
            this.velocityY = 0
            this.jump = false
        }
        if (this.posX >= 200 - this.width) {
            this.velocityX = 0
            this.rEdge = true
        } else {
            this.rEdge = false
        }
        if (this.posX <= 0) {
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

const MEGAMAN = new player(120,190,24,24,0,0,1)
const PLATS = [new object(180,150,48,16), new object(280,100,48,16), new object(380,150,48,16), new object(480,200,48,16)]

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
const KEYS = {
    up: false,
    down: false,
    right: false,
    left: false
}
document.addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'ArrowUp':
            MEGAMAN.jump = false
            KEYS.up = true
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
            if(MEGAMAN.velocityY==0) {
                MEGAMAN.jump = true
                KEYS.up = false
            }
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

// function moveLeft (n) {
//     if(!MEGAMAN.lEdge) {
//         MEGAMAN.velocityX = n
//     }
// }

// function moveRight (n) {
//     if(!MEGAMAN.rEdge) {
//         MEGAMAN.velocityX = n
//     }
// }

// function moveJump(n) {
//     if(!MEGAMAN.jump) {
//         MEGAMAN.velocityY = n
//         MEGAMAN.jump = true
//     }
// }

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
    PLATS.forEach(PLAT => {
        PLAT.draw()
    })
    if (MEGAMAN.moveRight && MEGAMAN.rEdge) {
        PLATS.forEach((PLAT) => {
            PLAT.posX -= 3
        })
        MEGAMAN.steps += 3
    }
    if (MEGAMAN.moveLeft && MEGAMAN.lEdge && MEGAMAN.steps > 0) {
        console.log(MEGAMAN.posX)
        PLATS.forEach((PLAT) => {
            PLAT.posX += 3
        })
        MEGAMAN.steps -= 3
    }
    if (KEYS.right) {
        MEGAMAN.velocityX = +3
    } else {
        MEGAMAN.velocityX = 0
    }
    //collision
    PLATS.forEach((PLAT) => {
        //old
        // if (MEGAMAN.posY <= PLAT.posY + PLAT.height && MEGAMAN.posY + MEGAMAN.velocityY >= PLAT.posY &&  MEGAMAN.posX + MEGAMAN.width >= PLAT.posX && MEGAMAN.posX <= PLAT.posX + PLAT.width) {
        //     MEGAMAN.velocityY = 1
        // } 
        // if (MEGAMAN.posY + MEGAMAN.height <= PLAT.posY && MEGAMAN.posY + MEGAMAN.height + MEGAMAN.velocityY >= PLAT.posY && MEGAMAN.posX + MEGAMAN.width >= PLAT.posX && MEGAMAN.posX <= PLAT.posX+PLAT.width) {
        //     MEGAMAN.velocityY = 0
        //     MEGAMAN.jump = false
            if (
                MEGAMAN.posX + MEGAMAN.width >= PLAT.posX &&
                MEGAMAN.posX <= PLAT.posX + PLAT.width &&
                MEGAMAN.posY + MEGAMAN.height >= PLAT.posY &&
                MEGAMAN.posY <= PLAT.posY + PLAT.height
            ) {
            // Check collision side
            const overlapX = Math.min(MEGAMAN.posX + MEGAMAN.width, PLAT.posX + PLAT.width) - Math.max(MEGAMAN.posX, PLAT.posX);
            const overlapY = Math.min(MEGAMAN.posY + MEGAMAN.height, PLAT.posY + PLAT.height) - Math.max(MEGAMAN.posY, PLAT.posY);
            if (overlapX > overlapY) {
                if (MEGAMAN.posY < PLAT.posY) {
                    // console.log('Hit bottom side');
                    MEGAMAN.velocityY = 0
                    MEGAMAN.jump = false
                } else {
                    // console.log('Hit top side');
                    MEGAMAN.velocityY = 1
                }
            } else {
                if (MEGAMAN.posX < PLAT.posX) {
                    // console.log('Hit right side');

                } else {
                    // console.log('Hit left side');
                }
            }
            }
    })
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