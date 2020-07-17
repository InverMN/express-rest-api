import { Secure } from '../middleware/index.js'
import { Post, Feedback, Comment } from '../models/index.js'
import { Controller } from './common/index.js'

export const Reactions = new Controller()

Reactions.get('/feedbacks/:id', async (req, res) => {
	const targetId = req.params.id

	const feedback = await Feedback.findById(targetId)
	if(feedback === null)
		throw 'not found feedback'

	res.send(feedback)
})

Reactions.post('/like/:id', Secure.USER, async (req, res) => {
	const targetId = req.params.id

	const target = await Post.findById(targetId) || await Comment.findById(targetId)
	if(target === null)
		throw 'not found post/comment'

	await unlike(target, req.user)
	like(target, req.user)

	res.sendStatus(200)
})

Reactions.post('/dislike/:id', Secure.USER, async (req, res) => {
	const targetId = req.params.id

	const target = await Post.findById(targetId) || await Comment.findById(targetId)
	if(target === null)
		throw 'not found post/comment'

	await unlike(target, req.user)
	dislike(target, req.user)

	res.sendStatus(200)
})

Reactions.post('/unlike/:id', Secure.USER, async (req, res) => {
	const targetId = req.params.id

	const target = await Post.findById(targetId) || await Comment.findById(targetId)
	if(target === null)
		throw 'not found post/comment'

	unlike(target, req.user)

	res.sendStatus(200)
})

async function like(document, user) {
	const feedback = await Feedback.findById(document.popularity.feedback)
	if(!feedback.positive.includes(user._id)) {
		feedback.positive.push(user._id)
		await feedback.save()
		document.popularity.sum = feedback.positive.length - feedback.negative.length
		await document.save()
	}
}

async function dislike(document, user) {
	const feedback = await Feedback.findById(document.popularity.feedback)
	if(!feedback.negative.includes(user._id)) {
		feedback.negative.push(user._id)
		await feedback.save()
		document.popularity.sum = feedback.positive.length - feedback.negative.length
		await document.save()
	}
}

async function unlike(document, user) {
	const feedback = await Feedback.findById(document.popularity.feedback)

	if(feedback.positive.includes(user._id))
		removeFromArray(feedback.positive, user._id)
	else if(feedback.negative.includes(user._id)) 
		removeFromArray(feedback.negative, user._id)

	await feedback.save()
	document.popularity.sum = feedback.positive.length - feedback.negative.length
	await document.save()
}

function removeFromArray(array, element) {
	const index = array.indexOf(element)
	if(index > -1) 
		array.splice(index, 1)
}