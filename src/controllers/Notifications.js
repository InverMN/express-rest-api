import { Secure } from '../middleware/index.js'
import  { Notification } from '../models/index.js'
import { Controller, documentToData } from './common/index.js'

export const Notifications = new Controller()

Notifications.get('/notifications', Secure.USER, async (req, res) => {
	const notifications = await Notification.find({ receiver: { id: req.user._id } })
	res.send(documentToData(notifications))
})