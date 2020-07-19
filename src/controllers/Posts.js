import { Secure } from '../middleware/index.js'
import { Post } from '../models/index.js'
import { update, appendUserReaction, Controller, documentToData } from './common/index.js'

export const Posts = new Controller()

Posts.get('/posts', Secure.CHECK, async (req, res) => {
	let posts = await (await Post.find().populate({ path: 'replies', populate: { path: 'replies', model: 'Comment' } })).reverse()

	posts = documentToData(posts)

	if(req.user !== undefined) {
		posts = await appendUserReaction(posts, req.user._id)
		try {
			posts = await Promise.all(posts.map(async singlePost => {
				let comments = await appendUserReaction(singlePost.replies, req.user._id)

				comments = await Promise.all(comments.map(async singleComment => ({ ...singleComment, replies: await  appendUserReaction(singleComment.replies, req.user._id)})))

				return { ...singlePost, replies:  comments}
			}))
		} catch(error) {
			console.log(error)
		}
	}

	res.send(posts)
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

	const { _id, ...otherProps } = post._doc
	res.send({ id: _id, ...otherProps })
})

Posts.get('/posts/:id', Secure.CHECK, async (req, res) => {
	let post = await Post.findById(req.params.id) 
	if(post === null)
		throw 'not found post'

	if(req.user !== undefined)
		post = await appendUserReaction(post, req.user._id)

	const { _id, ...otherProps } = post._doc
	res.send({ id: _id, ...otherProps })
})

Posts.delete('/posts/:id', Secure.OWNER, async (req, res) => {
	const post = await Post.findById(req.params.id)
	if(post === null)
		throw 'not found post'

	req.verifyOwnership(post.author.id)
	await post.remove()
	const { _id, ...otherProps } = post._doc
	res.send({ id: _id, ...otherProps })
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
	const { _id, ...otherProps } = post._doc
	res.send({ id: _id, ...otherProps })
})