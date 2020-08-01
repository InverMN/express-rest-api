import mongoose from 'mongoose'
const Schema = mongoose.Schema
import { Author as User, NotificationSubjects } from './common/index.js'

const data = {
	sender: User,
	receiver: {
		type: User,
		required: true
	},
	subject: {
		type: NotificationSubjects,
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

export const Notification = mongoose.model('Notification', schema)