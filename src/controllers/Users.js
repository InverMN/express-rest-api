import { User } from '../models/index.js'
import { Secure } from '../middleware/index.js'
import { hashPassword } from '../services/password.js'
import { Controller, update } from './common/index.js'

export const Users = new Controller()

Users.get('/users', Secure.MODERATOR, async (req, res) => {
	const users = await User.find()
	res.send(users)
})

Users.post('/users', async (req, res) => {
	const { username, password, email } = req.body

	if(password === undefined) 
		throw 'missing password'

	if(password.length <= 5)
		throw 'short password excepted 6'

	if(password.length >= 199)
		throw 'long password excepted 200'

	const user = new User({ email, hashedPassword: hashPassword(password), username })
	await user.save()
	res.send(user)
})

Users.get('/users/:id', async (req, res) => {
	const user = await User.findOne({ _id: req.params.id })
	if(user === null)
		throw 'not found user'

	res.send(user)
})

Users.delete('/users/:id', async (req, res) => {
	const user = await User.findOne({ _id: req.params.id })
	if(user === null)
		throw 'not found user'

	user.remove()
	res.send(user)
})	

Users.patch('/users/:id', Secure.OWNER, async (req, res) => {
	const user = await User.findOne({ _id: req.params.id })
	if(user === null)
		throw 'not found user'

	if('password' in req.body) {
		const { password } = req.body

		if(password === undefined) 
			throw 'missing password'
	
		if(password.length <= 5)
			throw 'short password excepted 6'
	
		if(password.length >= 199)
			throw 'long password excepted 200'

		req.body.hashedPassword = hashPassword(password)
	}

	update(user, req.body, ['username','email','hashedPassword'])

	await user.save()
	res.send(user)
})