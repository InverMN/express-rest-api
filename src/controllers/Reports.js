import { Controller } from './common/index.js'
import { Secure } from '../middleware/index.js'
import { Report, Post, Comment } from '../models/index.js'
import { documentToData } from './common/index.js'

export const Reports = new Controller()

Reports.get('/reports', Secure.MODERATOR, async (req, res) => {
	const reports = await Report.find()
	res.send(documentToData(reports))
})

Reports.post('/report/:target/:id', Secure.USER, async (req, res) => {
	const { target: targetType, id: targetId } = req.params
	
	const doesTargetExist = await Post.exists({ _id: targetId }) || await Comment.exists({ _id: targetId })
	const isTargetTypeCorrect = targetType === 'post' || targetType === 'reply'
	
	if(!(doesTargetExist || isTargetTypeCorrect)) res.sendCode(400)
	
	let postId

	if(targetType === 'post')
		postId = targetId
	else if(await Post.exists({ replies: { $in: [targetId] } }))
		postId = (await Post.findOne({ replies: { $in: [targetId] } })).id
	else {
		let superParentComment = await Comment.findOne({ replies: { $in: [targetId] } })
		postId = (await Post.findOne({ replies: { $in: [superParentComment.id] } })).id
	}

	const data = { postId }
	if(targetType !== 'post') data.replyId = targetId
	
	if(await Report.exists({ data })) {
		const existingReport = await Report.findOne({ data })
		existingReport.times++
		existingReport.save()
	} else {
		const reportDocument = {
			sender: {
				id: req.user.id,
				username: req.user.username
			},
			target: targetType,
			data
		}
		
		const reportModel = new Report(reportDocument)
		reportModel.save()
	}

	res.send('OK')
})

Reports.delete('/reports/:id', Secure.MODERATOR, async (req, res) => {
	await Report.findByIdAndDelete(req.params.id)
	res.send('OK')
})