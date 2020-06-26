import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	title: String,
	body: String,
	owner: {
		types: Schema.Types.ObjectId,
		ref: 'User'
	}
}

export const Post = mongoose.model('Post', new Schema(data))