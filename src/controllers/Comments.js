import { Secure } from '../middleware/index.js'
import { Comment, Post } from '../models/index.js'
import { NotificationSubjects } from '../models/common/index.js'
import { update, appendUserReaction, Controller, documentToData } from './common/index.js'
import { createNotification } from '../services/notifications.js'

export const Comments = new Controller()

Comments.get('/comments/:id', Secure.CHECK, async (req, res) => {
	const targetId = req.params.id

	let comment = await Comment.findById(targetId)

	if(comment === null)
		throw 'not found comment'

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

	let comment = await new Comment(data)

	let target = await Post.findById(targetId) || await Comment.findById(targetId)

	if(target === null)
		throw 'not found post/comment'

	if(target.collection.name === 'comments') {
		let superParentComment = await Comment.findOne({ replies: { $in: [target._id] } })
		if(superParentComment !== null){
			target = superParentComment
			comment.replies = undefined
		}
	}

	target.replies.push(comment._id)
	await comment.save()
	target.save()

	if(toString(req.user._id) !== toString(target.author.id)) {
		const notificationSubject = target.collection.name === 'posts' ?  NotificationSubjects.REPLIED_POST : NotificationSubjects.REPLIED_COMMENT
		createNotification(req.user._id, target.author.id, notificationSubject, null)
	}

	comment =  documentToData(comment)
	comment = await appendUserReaction(comment, req.user._id)

	res.send(comment)
})

Comments.delete('/comments/:id', Secure.OWNER, async (req, res) => {
	const targetId = req.params.id

	const comment = await Comment.findById(targetId)

	req.verifyOwnership(comment.author.id)
	comment.remove()

	res.send(comment)
})

Comments.patch('/comments/:id', Secure.OWNER, async (req, res) => {
	const targetId = req.params.id

	let comment = await Comment.findById(targetId)
	if(comment === null)
		throw 'not found comment'
	
	req.verifyOwnership(comment.author.id)
	update(comment, req.body, ['body'])
	comment.editedAt = Date.now()
	comment.save()

	res.send(comment)
})