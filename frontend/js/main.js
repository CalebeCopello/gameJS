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
	ducking: false,
	running: false,
	jumping: {
		action: false,
		start: 0,
	},
	start: 0,
}

//variables
let PLAYERIMG = []
let PLAYER
let frameDuration = 90
let BGS
let BGIMG
let PLATS

//set display propierties
CV.width = 256 * DISPLAYSIZE
CV.height = 224 * DISPLAYSIZE
CV.style.backgroundColor = 'rgb(255,255,255)'
CTX.imageSmoothingEnabled = false

//function to set sprites for player
function setPlayerSprites() {
	const DIR = '../src/player/'
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
	PLAYERIMG.small.standing[0].src = DIR + 'small/sm01.png'
	PLAYERIMG.small.moving[0].src = DIR + '/small/sm02.png'
	PLAYERIMG.small.moving[1].src = DIR + '/small/sm03.png'
	PLAYERIMG.small.moving[2].src = DIR + '/small/sm04.png'
	PLAYERIMG.small.pivoting[0].src = DIR + '/small/sm05.png'
	PLAYERIMG.small.jumping[0].src = DIR + '/small/sm06.png'
	PLAYERIMG.small.dying[0].src = DIR + '/small/sm07.png'
	PLAYERIMG.small.banner[0].src = DIR + '/small/sm08.png'
	PLAYERIMG.small.banner[1].src = DIR + '/small/sm09.png'
}

//function to set sprites for scenario
function setScenarioTiles() {
	const DIR = '../src/scenario/'
	BGIMG = [new Image()]
	BGIMG[0].src = DIR + 'palette2/ws0.png'

	BASEIMG = [new Image()]
	BASEIMG[0].src = DIR + 'palette1/gs1.png'
}
setScenarioTiles()

//function to load scenario

async function loadScenario() {
	try {
		const data = await fetch('../src/default.json')
		if (!data.ok) {
			throw new Error('Network response was not ok')
		}
		const scenario = await data.json()
		for (let x = 0; x < Object.keys(scenario.background).length; x++) {
			for (let y = 0; y < Object.keys(scenario.background[x]).length; y++) {
				BGS.push(
					new background(
						x * (16 * DISPLAYSIZE),
						y * (16 * DISPLAYSIZE),
						scenario.background[x][y]
					)
				)
			}
		}
		for (let x = 0; x < Object.keys(scenario.base).length; x++) {
			for (let y = 0; y < Object.keys(scenario.base[x]).length; y++) {
				if (scenario.base[x][y] != 0)
					PLATS.push(
						new object(
							x * (16 * DISPLAYSIZE),
							y * (16 * DISPLAYSIZE),
							scenario.base[x][y] - 1
						)
					)
			}
		}
	} catch (error) {
		console.log(error)
	}
}
loadScenario()

function initGame() {
	PLAYER = new player(150 * DISPLAYSIZE, 150 * DISPLAYSIZE)
	BGS = []
	PLATS = []
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
		this.size = 'small'
	}
	draw() {
		if (this.size == 'small') {
			CTX.save()
			if (!MOVESTATS.facingRight) {
				CTX.scale(-1, 1)
			}
			if (MOVESTATS.jumping.action) {
				this.image = PLAYERIMG.small.jumping[0]
			} else if (MOVESTATS.moving && !MOVESTATS.jumping.action) {
				this.image = PLAYERIMG.small.moving[MOVESTATS.frame]
			} else if (!MOVESTATS.moving && !MOVESTATS.jumping.action) {
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
			CTX.strokeStyle = '#f00'
			CTX.lineWidth = 1
			CTX.strokeRect(
				// this.posX,
				this.posX + 2 * DISPLAYSIZE,
				this.posY,
				// 16 * DISPLAYSIZE,
				16 * DISPLAYSIZE - 4 * DISPLAYSIZE,
				16 * DISPLAYSIZE
			)
		}
	}
	update() {
		const now = performance.now()
		const elapsedFrame = Math.floor((now - this.startTime) / frameDuration)
		// TODO:code for running
		// if(now >= MOVESTATS.start+500 && now < MOVESTATS.start+1000) {
		// 	frameDuration = 50
		// 	console.log('frameDuration = 40')
		// }
		// else if(now >= MOVESTATS.start+1000) {
		// 	frameDuration = 30
		// 	console.log('frameDuration = 10')
		// }

		if (MOVESTATS.moving) {
			MOVESTATS.frame = elapsedFrame % 3
		}

		this.posY += this.velocityY
		if (this.posY + this.height + this.velocityY <= CV.height) {
			this.velocityY += GRAVITY
		} else {
			this.velocityY = 0
			MOVESTATS.jumping.action = false
		}
		this.draw()
	}
}

//scenario set

class background {
	constructor(posX, posY, code) {
		this.posX = posX
		this.posY = posY
		this.code = code
	}
	draw() {
		CTX.drawImage(
			BGIMG[this.code],
			this.posX,
			this.posY,
			16 * DISPLAYSIZE,
			16 * DISPLAYSIZE
		)
	}
}

class object {
	constructor(posX, posY, code) {
		this.posX = posX
		this.posY = posY
		this.code = code
		this.width = 16 * DISPLAYSIZE
		this.height = 16 * DISPLAYSIZE
	}
	draw() {
		CTX.drawImage(
			BASEIMG[this.code],
			this.posX,
			this.posY,
			16 * DISPLAYSIZE,
			16 * DISPLAYSIZE
		)
	}
}

//controler input
document.addEventListener('keydown', ({ key }) => {
	console.log(key)
	switch (key) {
		case 'a':
		case 'ArrowLeft':
			MOVEINPUT.left = true
			MOVESTATS.facingRight = false
			// if(!MOVESTATS.moving) MOVESTATS.start = performance.now()
			MOVESTATS.moving = true
			break
		case 'd':
		case 'ArrowRight':
			MOVEINPUT.right = true
			MOVESTATS.facingRight = true
			// if(!MOVESTATS.moving) MOVESTATS.start = performance.now()
			MOVESTATS.moving = true
			break
		case 'w':
		case 'ArrowUp':
			if (!MOVESTATS.jumping.action && !MOVEINPUT.up) {
				MOVEINPUT.up = true
				MOVESTATS.jumping.action = true
				MOVESTATS.jumping.start = performance.now()
				MOVESTATS.frame = 0
				PLAYER.velocityY -= VELOCITYY
			}
			break
		default:
	}
})
document.addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'a':
		case 'ArrowLeft':
			MOVEINPUT.left = false
			MOVESTATS.moving = false
			break
		case 'd':
		case 'ArrowRight':
			MOVEINPUT.right = false
			MOVESTATS.moving = false
			break
		case 'w':
		case 'ArrowUp':
			MOVEINPUT.up = false
			break
		default:
	}
})

//animation
function animation() {
	requestAnimationFrame(animation)
	CTX.clearRect(0, 0, CV.width, CV.height)
	BGS.forEach((BG) => {
		BG.draw()
	})
	PLATS.forEach((PLAT) => {
		PLAT.draw()
	})
	PLATS.forEach((PLAT) => {
		if (
			PLAYER.posX + PLAYER.width >= PLAT.posX &&
			PLAYER.posX <= PLAT.posX + PLAT.width &&
			PLAYER.posY + PLAYER.height + PLAYER.velocityY >= PLAT.posY &&
			PLAYER.posY + PLAYER.velocityY <= PLAT.posY + PLAT.height
		) {
			const overlapX =
				Math.min(PLAYER.posX + PLAYER.width, PLAT.posX + PLAT.width) -
				Math.max(PLAYER.posX, PLAT.posX)

			const overlapY =
				Math.min(PLAYER.posY + PLAYER.height, PLAT.posY + PLAT.height) -
				Math.max(PLAYER.posY, PLAT.posY)
			if (overlapX > overlapY) {
				if (PLAYER.posY < PLAT.posY) {
					PLAYER.velocityY = 0
					MOVESTATS.jumping.action = false
				} else {
					PLAYER.posY = PLAT.posY + PLAT.height
					PLAYER.velocityY = 0
				}
			} else {
				if (PLAYER.posX < PLAT.posX) {
					PLAYER.posX = PLAT.posX - PLAT.width
					MOVEINPUT.right = false
					console.log('hit right')
				} else {
					PLAYER.posX = PLAT.posX + PLAT.width
					MOVEINPUT.left = false
				}
			}
		}
	})
	PLAYER.update()
	if (MOVEINPUT.right) {
		PLATS.forEach((PLAT) => {
			PLAYER.velocityX = 0
			PLAT.posX -= VELOCITYX
		})
	}
	if (MOVEINPUT.left) {
		PLATS.forEach((PLAT) => {
			PLAYER.velocityX = 0
			PLAT.posX += VELOCITYX
		})
	}
}
setPlayerSprites()
initGame()
animation()
