import { User } from '../models/index.js'
import { createNotification } from './index.js'
import { NotificationSubjects } from '../models/common/index.js'

export async function processMentions({ body, senderId, postId, replyId }) {
	const words = body.split(/ |<|>/)

	words.forEach(async word => {
		console.log(word)
		if(word.startsWith('@')) {
			const username = word.replace(/@/, '')

			if(await User.exists({ username })) {
				const receiverId = await (await User.findOne({ username })).id
				createNotification(senderId, receiverId, NotificationSubjects.MENTIONED, { postId, replyId })
			}
		}
	})
}