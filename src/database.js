import mongoose from 'mongoose'

const config = {
	uris: 'mongodb://localhost:27017/blog',
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
}

mongoose.connect(config.uris, config.options)

mongoose.connection.once('open', () => console.info('Connected to database'))
mongoose.connection.on('error', error => console.error(error))

export default mongoose.connection