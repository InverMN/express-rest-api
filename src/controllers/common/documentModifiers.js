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
	input = extractData(input)
	input = renameID(input)
	input = removeV(input)
	return input
}

function renameID(input) {
	if(input instanceof Array) {
		return input.map(singlePost => {
			const { _id, ...otherProps } = singlePost
			return { id: _id, ...otherProps }
		})
	} else {
		const { _id, ...otherProps } = input
		return { id: _id, ...otherProps }
	}
}

function removeV(input) {
	if(input instanceof Array) {
		return input.map(singlePost => {
			const { __v, ...otherProps } = singlePost
			return { ...otherProps }
		})
	} else {
		const { __v, ...otherProps } = input
		return { ...otherProps }
	}
}

function extractData(input) {
	if(input instanceof Array)
		return input.map(singleDocument => singleDocument._doc)
	else return input._doc
}