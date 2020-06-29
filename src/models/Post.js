import mongoose from 'mongoose'
import { Popularity, Author, Comments } from './common/index.js'
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
	comments: Comments
}

export const Post = mongoose.model('Post', new Schema(data))