import mongoose from 'mongoose'
import { Popularity, Author, Comments } from './common/index.js'
import { Feedback, CommentBlock } from './index.js'
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

const schema = new Schema(data)

const init = async document => {
	const feedback = await new Feedback()
	document.popularity = {
		feedback: feedback._id, 
		sum: 0
	}
	feedback.save()

	const commentBlock = await new CommentBlock()
	document.comments =  {
		commentBlock:	commentBlock._id
	}
	commentBlock.save()
}

schema.pre('save', async function(next) {
	if(this.isNew)
		await init(this)
	next()
})

export const Post = mongoose.model('Post', schema)