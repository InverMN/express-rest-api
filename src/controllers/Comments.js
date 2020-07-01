import express from 'express'
import Secure from '../middleware/secured.js'
import { Comment, Post } from '../models/index.js'
import { appendUserReaction } from '../services/documentModifiers.js'
import { update } from './common/index.js'

export const Comments = new express.Router()

Comments.get('/comments/:id', Secure.CHECK, async (req, res) => {
	try {
		const targetId = req.params.id

		let comment = await Comment.findById(targetId)

		if(req.user !== undefined)
			comment = await appendUserReaction(comment, req.user._id)

		res.send(comment)
	} catch(error) {
		console.log(error)
		res.send(error)
	}
})

Comments.post('/comments/:id', Secure.USER ,async (req, res) => {
	try {
		const { body } = req.body
		const targetId  = req.params.id

		const data = {
			author: {
				username: req.user.username,
				id: req.user._id
			},
			body 
		}

		const comment = await new Comment(data)

		let target = await Post.findById(targetId) || await Comment.findById(targetId)

		if(target.collection.name === 'comments') {
			let superParentComment = await Comment.findOne({ replies: { $in: [target._id] } })
			if(superParentComment !== null)
				target = superParentComment
		}

		target.replies.push(comment._id)
		comment.replies = undefined
		comment.save()
		target.save()

		res.send(comment)
	} catch (error) {
		console.log(error)
		res.send(error)
	}
})

Comments.delete('/comments/:id', Secure.OWNER, async (req, res) => {
	try {
		const targetId = req.params.id

		const comment = await Comment.findById(targetId)
		if(!req.verifyOwnership(comment.author.id)) throw null
		comment.remove()

		res.send(comment)
	} catch (error) {
		console.log(error)
		res.sendStatus(401)
	}
})

Comments.patch('/comments/:id', Secure.OWNER, async (req, res) => {
	try {
		const targetId = req.params.id

		const comment = await Comment.findById(targetId)
		if(!req.verifyOwnership(comment.author.id)) throw null
		update(comment, req.body, ['body'])
		comment.editedAt = Date.now()
		comment.save()

		res.send(comment)
	} catch (error) {
		console.log(error)
		res.send(error)
	}
})