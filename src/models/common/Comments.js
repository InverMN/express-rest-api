import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	comments: {
		type: 'ObjectId',
		ref: 'CommentBlock'
	},
	count: {
		type: Number,
		default: 0
	}
}

export default new Schema(data)