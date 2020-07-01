import { Feedback } from '../models/Feedback.js'

export async function appendUserReaction(documents, userId) {
	return await Promise.all(documents.map(async singleDocument => {
		const data = await { ...singleDocument._doc }

		const feedbackId = data.popularity.feedback
		const feedback = await Feedback.findById(feedbackId)

		if(feedback.positive.includes(userId))
			data.userReaction = 'positive'
		else if(feedback.negative.includes(userId))
			data.userReaction = 'negative'
		else 
			data.userReaction = 'none'

		return data
	}))
}