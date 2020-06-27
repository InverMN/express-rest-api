import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { openDatabase, openTestDatabase } from './database.js'
import * as Controllers from './controllers/index.js'

export function run(method = 'production') {
	let database

	if(method === 'production') database = openDatabase() 
	else if(method === 'tests') database = openTestDatabase()

	database.once('open', () => {
		dotenv.config()
	
		const app = express()
	
		app.use(bodyParser.json())
		app.use(cookieParser())
	
		app.use('/static', express.static('public'))
		app.get('/', (_, res) => res.send('Homepage'))
		
		/* Add controllers to app */
		for(const controller in Controllers) {
			app.use('/', Controllers[controller])
		}
		
		/* Start listening */
		const port = parseInt(process.env.PORT)
		console.info(`Listening on localhost:${port}`)
		
		app.server = app.listen(port)
		return app
	})
}