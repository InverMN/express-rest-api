import { Secure } from '../middleware/index.js'
import { Comment, Post } from '../models/index.js'
import { update, appendUserReaction, Controller } from './common/index.js'

export const Comments = new Controller()

Comments.get('/comments/:id', Secure.CHECK, async (req, res) => {
	const targetId = req.params.id

	let comment = await Comment.findById(targetId)

	if(req.user !== undefined)
		comment = await appendUserReaction(comment, req.user._id)

	res.send(comment)
})

Comments.post('/comments/:id', Secure.USER ,async (req, res) => {
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
		if(superParentComment !== null){
			target = superParentComment
			comment.replies = undefined
		}
	}

	target.replies.push(comment._id)
	comment.save()
	target.save()

	res.send(comment)
})

Comments.delete('/comments/:id', Secure.OWNER, async (req, res) => {
	const targetId = req.params.id

	const comment = await Comment.findById(targetId)
	if(!req.verifyOwnership(comment.author.id)) throw null
	comment.remove()

	res.send(comment)
})

Comments.patch('/comments/:id', Secure.OWNER, async (req, res) => {
	const targetId = req.params.id

	const comment = await Comment.findById(targetId)
	if(!req.verifyOwnership(comment.author.id)) throw null
	update(comment, req.body, ['body'])
	comment.editedAt = Date.now()
	comment.save()

	res.send(comment)
})