import mongoose from 'mongoose'
import Popularity from './common/Popularity.js'
import Author from './common/Author.js'
const Schema = mongoose.Schema

const common = {
	author: Author,
	createdAt: { 
		type: Date,
		default: Date.now
	},
	popularity: Popularity,
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