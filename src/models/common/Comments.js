import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	commentBlock: {
		type: 'ObjectId',
		ref: 'CommentBlock'
	},
	count: {
		type: Number,
		default: 0
	}
}

export const Comments = new Schema(data, { _id : false })