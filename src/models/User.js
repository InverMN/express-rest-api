import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	username: String,
	hashedPassword: String,
	email: String
}

const model = mongoose.model('user', new Schema(data))

export default model