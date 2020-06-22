import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import database from './database.js'
import * as Controllers from './controllers/index.js'

database.once('open', () => {
	dotenv.config()

	const app = express()

	app.use(bodyParser.json())
	app.use(cookieParser())

	app.get('/', (_, res) => res.send('Homepage'))
	
	/* Add controllers to app */
	for(const controller in Controllers) {
		app.use('/', Controllers[controller])
	}
	
	/* Start listening */
	const port = parseInt(process.env.PORT)
	app.listen(port)
	console.info(`Listening on localhost:${port}`)
})