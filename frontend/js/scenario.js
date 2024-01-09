const fs = require('fs')
const SCR_DIR = '../src/'
const MAP = SCR_DIR + 'default.json'

//constants
const background = {}
const base = {}
const foreground = {}
const cache = {
	background: background,
	base: base,
	foreground: foreground,
}
const height = 14
const width = 60
//background fill
for (let x = 0; x <= width; x++) {
	background[x] = {}
	for (let y = 0; y <= height; y++) {
		background[x][y] = 0
	}
}
//base fill
for (let x = 0; x <= width; x++) {
	base[x] = {}
	for (let y = 0; y <= height; y++) {
		base[x][y] = 0
	}
}
//foreground fill
for (let x = 0; x <= width; x++) {
	foreground[x] = {}
	for (let y = 0; y <= height; y++) {
		foreground[x][y] = 0
	}
}

fs.writeFileSync(MAP, JSON.stringify(cache))
