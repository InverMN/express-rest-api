import express from 'express'
import Secure from '../middleware/secured.js'
import parse from '../services/errorParser.js'
import { Post } from '../models/index.js'
import { appendUserReaction } from '../services/documentModifiers.js'
import { update } from './common/index.js'

export const Posts = new express.Router()

Posts.get('/posts', Secure.CHECK, async (req, res) => {
	let posts = await Post.find()

	if(req.user !== undefined)
		posts = await appendUserReaction(posts, req.user._id)

	res.send(posts)
})

Posts.post('/posts', Secure.USER, async (req, res) => {
	try {
		const { title, body } = req.body
		const user = req.user
		const data = {
			title,
			body,
			author: {
				username: user.username,
				id: user._id
			}
		}

		const post = new Post(data) 
		await post.save()
		res.send(post)
	} catch (error) {
		res.status(400)
		res.send(parse(error))
	}
})

Posts.get('/posts/:id', Secure.CHECK, async (req, res) => {
	try {
		let post = await Post.findById(req.params.id) 

		if(req.user !== undefined)
			post = await appendUserReaction(post, req.user._id)

		res.send(post)
	} catch (error) {
		res.status(404)
	}
})

Posts.delete('/posts/:id', Secure.OWNER, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if(!req.verifyOwnership(post.author.id)) throw null
		await post.remove()
		res.send(post)
	} catch (error) {
		res.sendStatus(401)
	}
})

Posts.patch('/posts/:id', Secure.OWNER, async (req, res) => {
	try {
		const id = req.params.id
		if(!(await Post.exists({ _id: id }))) throw null
		const post = await Post.findById(id)
		if(!req.verifyOwnership(post._id)) throw null

		update(post, req.body, ['title', 'body'])
		
		post.editedAt = Date.now()
		await post.save()
		res.send(post)
	} catch (error) {
		console.log(error)
		res.sendStatus(401)
	}
})