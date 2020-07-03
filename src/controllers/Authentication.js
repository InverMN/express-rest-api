import { hashPassword, generateAccessToken,  generateRefreshToken, verifyRefreshToken, verifyEmailConfirmationToken, sendConfirmationEmail }  from '../services/index.js'
import  { User, Token } from '../models/index.js'
import { Controller } from './common/index.js'

export const Authentication = new Controller()

const day = 86400000

function createAndSendCredentials(userId, response) {
	const accessToken = generateAccessToken(userId)
	const refreshToken = generateRefreshToken(userId)
	response.cookie('REFRESH_TOKEN', refreshToken, { maxAge: day*15, httpOnly: true })
	response.json({ accessToken, refreshToken })
}

Authentication.post('/register', async (req, res) => {
	const { username, email, password } = req.body

	if(password === undefined) 
		throw 'missing password'

	if(password.length <= 5)
		throw 'short password excepted 6'

	if(password.length >= 199)
		throw 'long password excepted 200'

	const user = new User({ email, hashedPassword: hashPassword(password), username })
	await user.save()

	sendConfirmationEmail(user._id, email)

	createAndSendCredentials(user._id, res)
})

Authentication.get('/confirm/:token', async (req, res) => {
	const userId = (await verifyEmailConfirmationToken(req.params.token)).id
	// if(userId === undefined)
	// 	throw 'unauthenticated'

	const user = await User.findOne({ _id: userId })

	user.isVerified = true
	await user.save()

	createAndSendCredentials(user._id, res)
})

Authentication.post('/login', async (req, res) => {
	const { email, password } = req.body

	if(email === undefined) 
		throw 'missing email'

	if(password === undefined) 
		throw 'missing password'

	const user = await User.findOne({ email })

	if(user === null)
		throw 'incorrect email'

	if(user.hashedPassword !== hashPassword(password))
		throw 'incorrect password'

	createAndSendCredentials(user._id, res)
})

Authentication.post('/refresh', async (req, res) => {
	const token = req.cookies.REFRESH_TOKEN

	if(!token || await Token.exists({ body: token }))
		throw 'unauthenticated'

	await new Token({ body: token }).save()
	const userId = (await verifyRefreshToken(token)).id

	createAndSendCredentials(userId, res)
})

Authentication.delete('/logout', async (req, res) => {
	await new Token({ body: req.body.token }).save()
	res.sendStatus(204)
})