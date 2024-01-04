//constants
const CV = document.getElementById('display')
const CTX = CV.getContext('2d')
const GRAVITY = 0.5


//set display size
const DISPLAYSIZE = 3
CV.width = 256*DISPLAYSIZE
CV.height = 224*DISPLAYSIZE