import express from 'express'
import user from './user.js'
import auth from './auth.js'
import post from './post.js'

const router = new express.Router()

router.get('/', (_, res) => {
	res.send('API documentation soon')
})

router.use('/', user)
router.use('/', auth)
router.use('/', post)

export default router