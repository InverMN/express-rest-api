import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	username: String,
	id: {
		type: 'ObjectId',
		ref: 'User'
	}
}

export const Author = new Schema(data, { _id : false })