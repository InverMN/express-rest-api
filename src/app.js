const express = require('express')
const bodyParser = require("body-parser")

const database = require('./database')
const controllers = require('./controllers/controllers')

const app = express()

app.use(bodyParser.json())

app.get('/', (_, res) => res.send('Homepage'))
app.use('/api', controllers)

app.listen(5500)