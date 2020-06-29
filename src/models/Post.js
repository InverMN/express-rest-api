import mongoose from 'mongoose'
import Popularity from './common/Popularity.js'
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
	popularity: Popularity,
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