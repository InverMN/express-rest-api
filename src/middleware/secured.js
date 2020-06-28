import { verifyAccessToken } from '../services/jwt.js'
import { User } from '../models/index.js'

const extractUserId = async request => {
	try {
		const authHeader = request.headers.authorization
		const token = authHeader && authHeader.split(' ')[1]
		const userId = (await verifyAccessToken(token)).id 
		return userId
	} catch {
		return null
	}
}

const secureLogged = async (req, res, next) => {
	try {
		const userId = await extractUserId(req)
		if(userId === null) throw null
		
		const user = await User.findById(userId)
		if(!user || !user.isVerified) throw null
		
		req.user = user
		next()
	} catch {
		return res.sendStatus(401)
	}
}

function verifyOwnership(ownerRelation) {
	if(toString(this.user.id) === toString(ownerRelation) || this.user.isModerator) {
		return true
	} else if(ownerRelation === undefined) {
		this.response.sendStatus(500)
		throw 'Response body does not contain owner property'
	}
	else {
		this.response.sendStatus(401)
		this.response.send = () => {}
		this.response.sendStatus = () => {}
		return false
	}
}

const secureOwner = async (req, res, next) => {
	try {
		const userId = await extractUserId(req)
		if(userId === null) throw null

		const user = await User.findOne({ _id: userId })
		if(!user) throw null

		req.user = user
		req.response = res
		req.verifyOwnership = verifyOwnership
		next()
	} catch {
		return res.sendStatus(401)
	}
}

const secureModerator = async (req, res, next) => {
	try {
		const userId = await extractUserId(req)
		if(userId === null) throw null
		
		const user = await User.findOne({ _id: userId, isModerator: true })

		if(user)
			req.user = user
		else throw null

		next()
	} catch {
		return res.sendStatus(401)
	}
}

export default {
	USER: secureLogged,
	OWNER: secureOwner,
	MODERATOR: secureModerator
}