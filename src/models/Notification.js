import mongoose from 'mongoose'
const Schema = mongoose.Schema
import { Author as User, NotificationSubjects } from './common/index.js'
import { server } from '../socket/index.js'
import { documentToData } from '../controllers/common/index.js'

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

const init = async document => {
	document = documentToData(document)
	server.sendNotification(document)
}

schema.pre('save', async function(next) {
	if(this.isNew)
		await init(this)
	next()
})

export const Notification = mongoose.model('Notification', schema)