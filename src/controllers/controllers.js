const express = require('express')
const user = require('./user')

const router = new express.Router()

router.use('/', user)

module.exports = router