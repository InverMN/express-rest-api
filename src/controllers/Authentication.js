import express from 'express'
import { hashPassword }  from '../services/password.js'
import { generateAccessToken,  generateRefreshToken, verifyRefreshToken, verifyEmailConfirmationToken} from '../services/jwt.js'
import { sendConfirmationEmail } from '../services/emailVerification.js'
import  { User, Token } from '../models/index.js'
import parse from '../services/errorParser.js'

export const Authentication = new express.Router()

const day = 86400000

Authentication.post('/register', async (req, res) => {
	try {
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
	
		const accessToken = generateAccessToken(user._id)
		const refreshToken = generateRefreshToken(user._id)
		res.cookie('REFRESH_TOKEN', refreshToken, { maxAge: day*15, httpOnly: true })
		res.json({ accessToken, refreshToken })
	} catch (error) {
		res.status(400)
		res.send(parse(error))
	}
})

Authentication.get('/confirm/:token', async (req, res) => {
	try {
		const userId = (await verifyEmailConfirmationToken(req.params.token)).id
		const user = await User.findOne({ _id: userId })

		user.isVerified = true
		await user.save()

		res.sendStatus(200)
	} catch (error) {
		res.status(401).send(error)
	}
})

Authentication.post('/login', async (req, res) => {
	try {
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

		const accessToken = generateAccessToken(user._id)
		const refreshToken = generateRefreshToken(user._id)
		res.cookie('REFRESH_TOKEN', refreshToken, { maxAge: day*15, httpOnly: true })
		res.json({ accessToken, refreshToken })
	} catch (error) {
		res.status(401).send(parse(error))
	}
})

Authentication.post('/refresh', async (req, res) => {
	try {
		const token = req.cookies.REFRESH_TOKEN
	
		if(!token || await Token.exists({ body: token }))
			throw null
	
		await new Token({ body: token }).save()
		const userId = (await verifyRefreshToken(token)).id

		const accessToken = generateAccessToken(userId)
		const refreshToken = generateRefreshToken(userId)
		res.cookie('REFRESH_TOKEN', refreshToken, { maxAge: day*15, httpOnly: true })
		res.json({ accessToken, refreshToken })
	} catch {
		return res.sendStatus(401)
	}
})

Authentication.delete('/logout', async (req, res) => {
	await new Token({ body: req.body.token }).save()
	res.sendStatus(204)
})