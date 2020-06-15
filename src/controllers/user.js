const express = require('express')
const User = require('../models/User')

const router = new express.Router()

router.get('/users', async (req, res) => {
	const users = await User.find()
	res.send(users)
})

router.post('/users', async (req, res) => {
	console.log(req.body)

	const user = new User({
		username: req.body.username,
		hashedPassword: req.body.password,
		email: req.body.email
	})

	await user.save()
	res.send(user)
})

module.exports = router