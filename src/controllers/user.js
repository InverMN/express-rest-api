const express = require('express')
const User = require('../models/User')

const router = new express.Router()

router.get('/users', async (req, res) => {
	const users = await User.find()
	res.send(users)
})

module.exports = router