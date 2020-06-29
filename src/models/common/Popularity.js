import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	feedback: {
		type: 'ObjectId',
		ref: 'Feedback'
	},
	sum: {
		type: Number,
		default: 0
	}
}

export const Popularity = new Schema(data)