import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import { openDatabase, openTestDatabase } from './database.js'
import * as Controllers from './controllers/index.js'
import { createSocketServer } from './socket/index.js'

export function run(method = 'production') {
	if(method === 'production') openDatabase() 
	else openTestDatabase()

	dotenv.config()

	const app = express()

	app.use(bodyParser.json())
	app.use(cookieParser())
	app.use(fileUpload())
	app.use('/', (req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
		res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH')
		res.setHeader('Access-Control-Allow-Credentials', 'true')
		next()
	})

	app.use('/static', express.static('public'))
	app.get('/', (_, res) => res.send('Homepage'))
	
	/* Add controllers to app */
	for(const controller in Controllers) {
		app.use('/api/v1', Controllers[controller].router)
	}
	
	/* Start listening */
	const port = parseInt(process.env.PORT)
	console.info(`Listening on localhost:${port}`)
	
	app.server = app.listen(port)

	/* Start socket server */
	createSocketServer(app)

	return app
}