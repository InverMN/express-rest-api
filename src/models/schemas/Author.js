import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	username: String,
	id: {
		type: 'ObjectId',
		ref: 'User'
	}
}

export default new Schema(data)