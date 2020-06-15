import express from 'express'
import user from './user.js'

const router = new express.Router()

router.get('/', (_, res) => {
	res.send('API documentation soon')
})

router.use('/', user)

export default router