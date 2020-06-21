import express from 'express'
import { hashPassword }  from '../services/password.js'
import { generateAccessToken,  generateRefreshToken, verifyRefreshToken } from '../services/jwt.js'
import User from '../models/User.js'
import Token from '../models/Token.js'

const router = new express.Router()

router.post('/register', async (req, res) => {
	console.log('Register')
})

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email: email, hashedPassword: hashPassword(password) })

		if(!user) {
			return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
		}

		const accessToken = generateAccessToken(user._id)
		const refreshToken = generateRefreshToken(user._id)
		res.json({ accessToken, refreshToken })
	} catch (error) {
		res.status(400).send(error)
	}
})

router.post('/token', async (req, res) => {
	try {
		const token = req.body.token
	
		if(!token || await Token.exists({ body: token }))
			throw null
	
		await new Token({ body: token }).save()
		const user = await verifyRefreshToken(token, process.env.REFRESH_TOKEN_SECRET)

		const accessToken = generateAccessToken(user.id)
		res.json({ accessToken })
	} catch {
		return res.sendStatus(401)
	}
})

router.delete('/logout', async (req, res) => {
	await new Token({ body: req.body.token }).save()
	res.sendStatus(204)
})

export default router