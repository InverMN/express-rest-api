const express = require('express')
const user = require('./user')

const router = new express.Router()

router.get('/', (_, res) => {
	res.send('API documentation soon')
})

router.use('/', user)

module.exports = router