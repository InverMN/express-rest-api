import mongoose from 'mongoose'
const { Schema } = mongoose
import { Author as User } from './common/index.js'

const data = {
	sender: User,
	target: {
		type: String,
		required: true
	},
	data: Object,
	checked: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
}

const schema = new Schema(data)

export const Report = mongoose.model('Report', schema)