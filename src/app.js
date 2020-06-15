import express from 'express'
import bodyParser from 'body-parser'

import database from './database.js'
import controllers from './controllers/controllers.js'

const app = express()

app.use(bodyParser.json())

app.get('/', (_, res) => res.send('Homepage'))
app.use('/api', controllers)

app.listen(5500)