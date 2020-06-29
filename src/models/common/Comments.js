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

export const Comments = new Schema(data, { _id : false })