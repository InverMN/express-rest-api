import express from 'express'
import Secure from '../middleware/secured.js'
import { Post, Feedback, Comment } from '../models/index.js'

export const Reactions = new express.Router()

Reactions.get('/feedbacks/:id', async (req, res) => {
	try {
		const targetId = req.params.id

		const feedback = await Feedback.findById(targetId)

		res.send(feedback)
	} catch (error) {
		console.log(error)
		res.send(error)
	}
})

Reactions.post('/like/:id', Secure.USER, async (req, res) => {
	try {
		const targetId = req.params.id

		const target = await Post.findById(targetId) || await Comment.findById(targetId)

		await unlike(target, req.user)
		like(target, req.user)

		res.sendStatus(200)
	} catch (error) {
		res.send(error)
	}
})

Reactions.post('/dislike/:id', Secure.USER, async (req, res) => {
	try {
		const targetId = req.params.id

		const target = await Post.findById(targetId) || await Comment.findById(targetId)

		await unlike(target, req.user)
		dislike(target, req.user)

		res.sendStatus(200)
	} catch (error) {
		res.send(error)
	}
})

Reactions.post('/unlike/:id', Secure.USER, async (req, res) => {
	try {
		const targetId = req.params.id

		const target = await Post.findById(targetId) || await Comment.findById(targetId)

		unlike(target, req.user)

		res.sendStatus(200)
	} catch (error) {
		res.send(error)
	}
})

async function like(document, user) {
	if(user.id.toString() !== document.author.id.toString()) {
		const feedback = await Feedback.findById(document.popularity.feedback)
		if(!feedback.positive.includes(user._id)) {
			feedback.positive.push(user._id)
			await feedback.save()
			document.popularity.sum = feedback.positive.length - feedback.negative.length
			await document.save()
		}
	}
}

async function dislike(document, user) {
	if(user.id.toString() !== document.author.id.toString()) {
		const feedback = await Feedback.findById(document.popularity.feedback)
		if(!feedback.negative.includes(user._id)) {
			feedback.negative.push(user._id)
			await feedback.save()
			document.popularity.sum = feedback.positive.length - feedback.negative.length
			await document.save()
		}
	}
}

async function unlike(document, user) {
	if(user.id.toString() !== document.author.id.toString()) {
		const feedback = await Feedback.findById(document.popularity.feedback)

		if(feedback.positive.includes(user._id))
			removeFromArray(feedback.positive, user._id)
		else if(feedback.negative.includes(user._id)) 
			removeFromArray(feedback.negative, user._id)

		await feedback.save()
		document.popularity.sum = feedback.positive.length - feedback.negative.length
		await document.save()
	}
}

function removeFromArray(array, element) {
	const index = array.indexOf(element)
	if(index > -1) 
		array.splice(index, 1)
}