import mongoose from 'mongoose'
const Schema = mongoose.Schema

const common = {
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
	...common
}

const reply = new Schema(subcommentData)

const commentData = {
	...common,
	replies: [reply]
}

const comment = new Schema(commentData)

//Watch out for an error
const commentSectionData = [comment]

export const CommentSection = mongoose.model('CommentSection', new Schema(commentSectionData))