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
	moving: false,
	running: false,
	start: 0,
}

//variables
let PLAYERIMG = []
let PLAYER
let frameDuration = 60

//set display propierties
CV.width = 256 * DISPLAYSIZE
CV.height = 224 * DISPLAYSIZE
CV.style.backgroundColor = 'rgb(255,255,255)'
CTX.imageSmoothingEnabled = false

//function to set sprites
function setPlayerSprites() {
	PLAYERIMG = {
		small: {
			standing: {
				0: new Image(),
			},
			moving: {
				0: new Image(),
				1: new Image(),
				2: new Image(),
			},
			pivoting: {
				0: new Image(),
			},
			jumping: {
				0: new Image(),
			},
			dying: {
				0: new Image(),
			},
			banner: {
				0: new Image(),
				1: new Image(),
			},
		},
	}
	PLAYERIMG.small.standing[0].src = '/src/player/small/sm01.png'
	PLAYERIMG.small.moving[0].src = '/src/player/small/sm02.png'
	PLAYERIMG.small.moving[1].src = '/src/player/small/sm03.png'
	PLAYERIMG.small.moving[2].src = '/src/player/small/sm04.png'
	PLAYERIMG.small.pivoting[0].src = '/src/player/small/sm05.png'
	PLAYERIMG.small.jumping[0].src = '/src/player/small/sm06.png'
	PLAYERIMG.small.dying[0].src = '/src/player/small/sm07.png'
	PLAYERIMG.small.banner[0].src = '/src/player/small/sm08.png'
	PLAYERIMG.small.banner[1].src = '/src/player/small/sm09.png'
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
		this.image = PLAYERIMG.small.standing[0]
		this.startTime = performance.now()
	}
	draw() {
		CTX.save()
		if (!MOVESTATS.facingRight) {
			CTX.scale(-1, 1)
		}
		if (MOVESTATS.moving) {
			this.image = PLAYERIMG.small.moving[MOVESTATS.frame]
		} else {
			this.image = PLAYERIMG.small.standing[0]
		}
		CTX.drawImage(
			this.image,
			MOVESTATS.facingRight ? this.posX : -this.posX - 16 * DISPLAYSIZE,
			this.posY,
			16 * DISPLAYSIZE,
			16 * DISPLAYSIZE
		)
		CTX.restore()
	}
	update() {
		console.log(MOVESTATS.start)
		const now = performance.now()
		if (MOVESTATS.start == 0) frameDuration = 60
		const elapsedFrame = Math.floor((now - this.startTime) / frameDuration)
		if (MOVESTATS.moving) {
			if(MOVESTATS.start >= 500) frameDuration = 50
			if(MOVESTATS.start >= 1000) frameDuration = 10
			MOVESTATS.frame = elapsedFrame % 3
		}
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
			MOVESTATS.moving = true
			MOVESTATS.start = performance.now()
			break
		case 'd':
		case 'ArrowRight':
			MOVEINPUT.right = true
			MOVESTATS.facingRight = true
			MOVESTATS.moving = true
			MOVESTATS.start = performance.now()
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
			MOVESTATS.moving = false
			MOVESTATS.start = 0
			break
		case 'd':
		case 'ArrowRight':
			MOVEINPUT.right = false
			MOVESTATS.moving = false
			MOVESTATS.start = 0
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
