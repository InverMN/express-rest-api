import { User } from '../models/index.js'
import { Secure } from '../middleware/index.js'
import { hashPassword, sendConfirmationEmail } from '../services/index.js'
import { Controller, update } from './common/index.js'
import JIMP from 'jimp'

export const Users = new Controller()

Users.get('/users', Secure.MODERATOR, async (req, res) => {
	const users = await User.find()
	res.send(users)
})

Users.get('/users/me', Secure.USER, async (req, res) => {
	const { _id, username, email, isVerified, isModerator } = req.user
	res.send({ id: _id, username, email, isVerified, isModerator })
})

Users.post('/users', Secure.MODERATOR, async (req, res) => {
	const { username, password, email } = req.body

	if(password === undefined) 
		throw 'missing password'

	if(password.length <= 5)
		throw 'short password expected 6'

	if(password.length >= 199)
		throw 'long password expected 200'

	const user = new User({ email, hashedPassword: hashPassword(password), username })
	await user.save()
	res.send(user)
})

Users.get('/users/:id', Secure.OWNER, async (req, res) => {
	const user = await User.findOne({ _id: req.params.id })
	if(user === null)
		throw 'not found user'

	req.verifyOwnership(user._id)	

	res.send(user)
})

Users.delete('/users/:id', Secure.OWNER, async (req, res) => {
	const user = await User.findOne({ _id: req.params.id })
	if(user === null)
		throw 'not found user'

	req.verifyOwnership(user._id)	

	user.remove()
	res.send(user)
})	

Users.patch('/users/:id', Secure.OWNER, async (req, res) => {
	const user = await User.findOne({ _id: req.params.id })
	if(user === null)
		throw 'not found user'

	req.verifyOwnership(user._id)	

	if('password' in req.body) {
		const { password } = req.body

		if(password === undefined) 
			throw 'missing password'
	
		if(password.length <= 5)
			throw 'short password expected 6'
	
		if(password.length >= 199)
			throw 'long password expected 200'

		req.body.hashedPassword = hashPassword(password)
	}

	update(user, req.body, ['username','email','hashedPassword'])

	await user.save()

	if('email' in req.body){
		sendConfirmationEmail(user._id, req.body.email)
		user.isVerified = false
		user.save()
	}

	res.send(user)
})

Users.post('/avatars', Secure.USER, async (req, res) => {
	JIMP.read(req.files.file.data, (err, avatar) => {
		if(!err) avatar.cover(256, 256).write(`public/avatars/${req.user._id}.png`)
	})
	res.sendCode(200)
})