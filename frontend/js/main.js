//constants
const CV = document.getElementById('display')
const CTX = CV.getContext('2d')
const DISPLAYSIZE = 3
const GRAVITY = 0.5 * DISPLAYSIZE
const VELOCITYX = 1 * DISPLAYSIZE
const VELOCITYY = 7 * DISPLAYSIZE
const MOVEINPUT = {
	up: false,
	down: false,
	right: false,
	left: false,
}
const MOVESTATS = {
	facingRight: true,
	running: false,
}

//variables
let PLAYERIMG = []
let PLAYER

//set display propierties
CV.width = 256 * DISPLAYSIZE
CV.height = 224 * DISPLAYSIZE
CV.style.backgroundColor = 'rgb(255,255,255)'
CTX.imageSmoothingEnabled = false

//function to set sprites
function setPlayerSprites() {
	PLAYERIMG = [new Image()]
	PLAYERIMG[0].src = '/src/player/small/sm01.png'
}

function initGame() {
	PLAYER = new player(1 * DISPLAYSIZE, 150 * DISPLAYSIZE)
}

//player set
class player {
	constructor(posX, posY) {
		this.posX = posX
		this.posY = posY
		this.velocityX = 0
		this.velocityY = 0
		this.width = 16 * DISPLAYSIZE
		this.height = 16 * DISPLAYSIZE
		this.image = PLAYERIMG[0]
		this.frame = 0
	}
	draw() {
		CTX.save()
		if(!MOVESTATS.facingRight) {
			CTX.scale(-1,1)
		}
		CTX.drawImage(
			this.image,
			MOVESTATS.facingRight ? this.posX : - this.posX - 16 * DISPLAYSIZE,
			this.posY,
			16 * DISPLAYSIZE,
			16 * DISPLAYSIZE
		)
		CTX.restore()
	}
	update() {
		this.draw()
	}
}

//controler input
document.addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'a':
		case 'ArrowLeft':
			MOVEINPUT.left = true
			MOVESTATS.facingRight = false
			break
		case 'd':
		case 'ArrowRight':
			MOVEINPUT.right = true
			MOVESTATS.facingRight = true
			break
		default:
			console.log(key)
	}
})
document.addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'a':
		case 'ArrowLeft':
			MOVEINPUT.left = false
			break
		case 'd':
		case 'ArrowRight':
			MOVEINPUT.right = false
			break
		default:
			console.log(key)
	}
})

//animation
function animation() {
	requestAnimationFrame(animation)
	CTX.clearRect(0, 0, CV.width, CV.height)
	PLAYER.update()
	if (MOVEINPUT.right) {
		PLAYER.posX += VELOCITYX
	}
	if (MOVEINPUT.left) {
		PLAYER.posX -= VELOCITYX
	}
}
setPlayerSprites()
initGame()
animation()
