import { Notification, User } from '../models/index.js'

export const createNotification = async (senderId, receiverId, subject, data) => {
	const [sender, receiver] = await Promise.all([ User.findById(senderId), User.findById(receiverId) ])

	const notification = new Notification({
		sender: { id: sender.id, username: sender.username },
		receiver: { id: receiver.id, username: receiver.username },
		subject,
		data,
	})

	notification.save()
}