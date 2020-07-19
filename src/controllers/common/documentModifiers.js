import { Feedback } from '../../models/index.js'

export async function appendUserReaction(input, userId) {
	if(input instanceof Array) 
		return await Promise.all(input.map(async singleDocument => await appendUserReactionToSingle(singleDocument, userId)))
	else 
		return await appendUserReactionToSingle(input, userId)
}

async function appendUserReactionToSingle(document, userId) {
	const data = { ...document }
	
	const feedbackId = data.popularity.feedback
	const feedback = await Feedback.findById(feedbackId)

	if(feedback.positive.includes(userId))
		data.userReaction = 'positive'
	else if(feedback.negative.includes(userId))
		data.userReaction = 'negative'
	else 
		data.userReaction = 'neutral'

	return data
}

export function documentToData(input){
	let jsonObject = JSON.stringify(input)

	jsonObject = jsonObject.replace(/_id/g, 'id')
	jsonObject = jsonObject.replace(/,"__v":.+?(?=})/g, '')

	return JSON.parse(jsonObject)
}