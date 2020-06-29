import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	author: String,
	owner: {
		type: 'ObjectId',
		ref: 'User'
	},
	createdAt: { 
		type: Date,
		default: Date.now
	},
	reactions: {
		positive: [mongoose.SchemaTypes.ObjectId],
		negative: [mongoose.SchemaTypes.ObjectId],
		sum: {
			type: Number,
			default: 0
		}
	},
	body: {
		type: String,
		required: true
	},
	title: {
		type: String,
		maxlength: 50,
		required: true
	},
	comments: {
		type: 'ObjectId',
		ref: 'CommentSection'
	},
}

export const Post = mongoose.model('Post', new Schema(data))