import express from 'express'
import { User } from '../models/index.js'
import Secure from '../middleware/secured.js'
import { hashPassword } from '../services/password.js'

export const Users = new express.Router()

Users.get('/users', Secure.MODERATOR, async (req, res) => {
	const users = await User.find()
	res.json(users)
})

Users.post('/users', async (req, res) => {
	const data = req.body

	if(data.username && data.password && data.email) {
		const user = new User({
			username: data.username,
			hashedPassword: hashPassword(data.password),
			email: data.email
		})
	
		await user.save()
		res.send(user)
	}
	else res.send('Incorrect input data structure')
})

Users.get('/users/:id', async (req, res) => {
	const user = await User.findOne({ _id: req.params.id })
	res.send(user)
})

Users.delete('/users/:id', async (req, res) => {
	try {
		await User.deleteOne({ _id: req.params.id })
    res.status(204).send()
	} catch {
		res.status(404)
		res.send({ error: 'User doesn\'t exist!' })
	}
})	

Users.patch('/users/:id', Secure.OWNER, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id })

		if(req.body.username)
			user.username = req.body.username

		if(req.body.password)
			user.hashedPassword = hashPassword(req.body.password)

		if(req.body.email)
			user.email = req.body.email

		await user.save()
		res.send(user)
	} catch {
		res.status(404)
		res.send({ error: 'User does not exist' })
	}
})