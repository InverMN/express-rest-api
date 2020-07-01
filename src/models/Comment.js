import mongoose from 'mongoose'
import { Popularity, Author } from './common/index.js'
import { Feedback, Post } from './index.js'
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
	const parent = await Post.findOne({ replies: { $in: [this._id] } }) || await Comment.findOne({ replies: { $in: [this._id] } })

	parent.replies = parent.replies.filter(replyRef => replyRef.toString() !== this.id.toString())
	await parent.save()

	next()
})

export const Comment = mongoose.model('Comment', schema)