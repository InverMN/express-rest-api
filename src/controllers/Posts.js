import express from 'express'
import Secure from '../middleware/secured.js'
import parse from '../services/errorParser.js'
import { Post } from '../models/index.js'

export const Posts = new express.Router()

Posts.get('/posts', async (_, res) => {
	const posts = await Post.find()
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

Posts.get('/posts/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id) 
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

function update(document, data, properties) {
	properties.forEach(property => {
		if(property in data) 
			document[property] = data[property]
	})
}

Posts.patch('/posts/:id', Secure.OWNER, async (req, res) => {
	try {
		const id = req.params.id
		if(!(await Post.exists({ _id: id }))) throw null
		const post = await Post.findById(id)
		if(!req.verifyOwnership(post._id)) throw null

		update(post, req.body, ['title', 'body'])
		
		await post.save()
		res.send(post)
	} catch (error) {
		console.log(error)
		res.sendStatus(401)
	}
})