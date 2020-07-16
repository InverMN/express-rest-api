import { Secure } from '../middleware/index.js'
import { Post } from '../models/index.js'
import { update, appendUserReaction, Controller } from './common/index.js'

export const Posts = new Controller()

Posts.get('/posts', Secure.CHECK, async (req, res) => {
	let posts = await (await Post.find()).reverse()

	if(req.user !== undefined)
		posts = await appendUserReaction(posts, req.user._id)

	const modifiedPosts = posts.map(singlePost => {
		const { _id, ...otherProps } = singlePost._doc
		return { id: _id, ...otherProps }
	})

	res.send(modifiedPosts)
})

Posts.post('/posts', Secure.USER, async (req, res) => {
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
})

Posts.get('/posts/:id', Secure.CHECK, async (req, res) => {
	let post = await Post.findById(req.params.id) 
	if(post === null)
		throw 'not found post'

	if(req.user !== undefined)
		post = await appendUserReaction(post, req.user._id)

	res.send(post)
})

Posts.delete('/posts/:id', Secure.OWNER, async (req, res) => {
	const post = await Post.findById(req.params.id)
	if(post === null)
		throw 'not found post'

	req.verifyOwnership(post.author.id)
	await post.remove()
	res.send(post)
})

Posts.patch('/posts/:id', Secure.OWNER, async (req, res) => {
	const id = req.params.id

	const post = await Post.findById(id)
	if(post === null)
		throw 'not found post'

	req.verifyOwnership(post.author.id)

	update(post, req.body, ['title', 'body'])
	
	post.editedAt = Date.now()
	await post.save()
	res.send(post)
})