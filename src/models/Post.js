import mongoose from 'mongoose'
const Schema = mongoose.Schema

const basicData = {
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
	}
}


const subcommentData = {
	...basicData
}

const subcomment = new Schema(subcommentData)

const commentData = {
	...basicData,
	subcomments: [subcomment]
}

const comment = new Schema(commentData)

const data = {
	...basicData,
	title: {
		type: String,
		maxlength: 50,
		required: true
	},
	comments: [comment]
}

export const Post = mongoose.model('Post', new Schema(data))