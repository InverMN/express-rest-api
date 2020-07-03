import mongoose from 'mongoose'

const config = {
	uris: 'mongodb://localhost:27017/blog',
	testsUris: 'mongodb://localhost:27017/tests',
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
}

export function openDatabase() {
	mongoose.connect(config.uris, config.options)
	mongoose.connection.once('open', () => console.info('Connected to database'))
	mongoose.connection.on('error', error => console.error(error))
	return mongoose.connection
}

export function openTestDatabase() {
	mongoose.connect(config.testsUris, config.options)
	mongoose.connection.once('open', () => console.info('Connected to database'))
	mongoose.connection.on('error', error => console.error(error))
	return mongoose.connection
}