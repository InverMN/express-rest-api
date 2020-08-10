import { Controller } from './common/index.js'
import { Secure } from '../middleware/index.js'
import { Report, Post, Comment } from '../models/index.js'

export const Reports = new Controller()

Reports.post('/report/:target/:id', Secure.USER, async (req, res) => {
	const { target: targetType, id: targetId } = req.params
	
	const doesTargetExist = await Post.exists({ _id: targetId }) || await Comment.exists({ _id: targetId })
	const isTargetTypeCorrect = targetType === 'post' || targetType === 'reply'
	
	if(!(doesTargetExist && isTargetTypeCorrect)) res.sendCode(400)
	
	const postId = targetType === 'post' ? targetId : (await Post.findOne({ replies: { $in: [targetId] } })).id 
	
	const data = {
		postId,
		replyId: targetType === 'post' ? undefined : targetId
	}
	
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