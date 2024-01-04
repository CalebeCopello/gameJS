const express = require('express')
const path = require('path')
const port = 9080

const app = express()

app.use(express.static(path.join(__dirname,  '../frontend')))

app.get('/', (req, res) => {
    res.render('index')
})

app.listen(port)

console.log(`http://localhost:${port}/`)