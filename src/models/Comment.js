import mongoose from 'mongoose'
import { Popularity, Author } from './common/index.js'
import { Feedback } from './index.js'
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

export const Comment = mongoose.model('Comment', schema)