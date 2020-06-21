import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	username: String,
	hashedPassword: String,
	email: String,
	isModerator: Boolean
}

export default mongoose.model('user', new Schema(data))