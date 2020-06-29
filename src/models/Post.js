import mongoose from 'mongoose'
import Popularity from './common/Popularity.js'
import Author from './common/Author.js'
const Schema = mongoose.Schema

const data = {
	author: Author,
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
		ref: 'CommentBlock'
	},
}

export const Post = mongoose.model('Post', new Schema(data))