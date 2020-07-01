import mongoose from 'mongoose'
import { Popularity, Author } from './common/index.js'
import { Feedback, Comment } from './index.js'
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
	replies: [{
		type: 'ObjectId',
		ref: 'Comment'
	}]
}

const schema = new Schema(data)

const init = async document => {
	const feedback = await new Feedback()
	document.popularity = {
		feedback: feedback._id, 
		sum: 0
	}
	feedback.save()
}

schema.pre('save', async function(next) {
	if(this.isNew)
		await init(this)
	next()
})

schema.pre('remove', async function(next) {
	this._doc.replies.forEach(async replyRef => {
		const comment = await Comment.findById(replyRef)
		comment.remove()
	})

	Feedback.findById(this._doc.popularity.feedback).then(it => it.remove())

	next()
})

export const Post = mongoose.model('Post', schema)