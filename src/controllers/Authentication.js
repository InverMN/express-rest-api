import express from 'express'
import { hashPassword }  from '../services/password.js'
import { generateAccessToken,  generateRefreshToken, verifyRefreshToken } from '../services/jwt.js'
import User from '../models/User.js'
import Token from '../models/Token.js'

export const Authentication = new express.Router()

const day = 86400000

Authentication.post('/register', async () => {
	console.log('Register')
})

Authentication.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email: email, hashedPassword: hashPassword(password) })

		if(!user) {
			return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
		}

		const accessToken = generateAccessToken(user._id)
		const refreshToken = generateRefreshToken(user._id)
		res.cookie('REFRESH_TOKEN', refreshToken, { maxAge: day*15, httpOnly: true })
		res.json({ accessToken, refreshToken })
	} catch (error) {
		res.status(400).send(error)
	}
})

Authentication.post('/refresh', async (req, res) => {
	try {
		const token = req.cookies.REFRESH_TOKEN
	
		if(!token || await Token.exists({ body: token }))
			throw null
	
		await new Token({ body: token }).save()
		const user = await verifyRefreshToken(token)

		const accessToken = generateAccessToken(user.id)
		const refreshToken = generateRefreshToken(user.id)
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