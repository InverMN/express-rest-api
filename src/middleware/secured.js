import { verifyAccessToken } from '../services/jwt.js'
import { User } from '../models/index.js'
import { handleError } from '../controllers/common/index.js'

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

const secureCheck = async (req, res, next) => {
	const userId = await extractUserId(req)
	if(userId !== null) {
		const user = await User.findById(userId)
		if(!user || !user.isVerified) throw null
		req.user = user
	}
	
	next()
}

const secureLogged = async (req, res, next) => {
	try {
		const userId = await extractUserId(req)
		if(userId === null) 
			throw 'unauthenticated'
		
		const user = await User.findById(userId)
		if(!user)
			throw 'not found user'

		if(!user.isVerified)
			throw 'forbidden expected verified'
		
		req.user = user
		next()
	} catch(error) {
		handleError(res, error)
	}
}

function verifyOwnership(ownerRelation) {
	if(toString(this.user.id) === toString(ownerRelation) || this.user.isModerator) {
		return true
	} else if(ownerRelation === undefined) {
		this.response.sendStatus(500)
		throw 'Response body does not contain owner property'
	} else {
		throw 'forbidden expected owner'
	}
}

const secureOwner = async (req, res, next) => {
	try {
		const userId = await extractUserId(req)
		if(userId === null) 
			throw 'unauthenticated'

		const user = await User.findOne({ _id: userId })
		if(!user) 
			throw 'not found user'

		req.user = user
		req.response = res
		req.verifyOwnership = verifyOwnership
		next()
	} catch(error) {
		handleError(res, error)
	}
}

const secureModerator = async (req, res, next) => {
	try {
		const userId = await extractUserId(req)
		if(userId === null) 
			throw 'unauthenticated'
		
		const user = await User.findOne({ _id: userId, isModerator: true })

		if(user)
			req.user = user
		else 
			throw 'forbidden expected moderator'

		next()
	} catch(error) {
		handleError(res, error)
	}
}

export const Secure = {
	CHECK: secureCheck,
	USER: secureLogged,
	OWNER: secureOwner,
	MODERATOR: secureModerator
}