import createSocket from 'socket.io'
import { createServer } from 'http'
import { OnlineUsers, User } from './index'
import { verifyAccessToken } from '../services/index'
import { User as UserModel } from '../models/index'

export function startServer(expressApp) {
	const httpServer = createServer(expressApp)
	const server = createSocket(httpServer)
	const onlineUsers = new OnlineUsers()

	server.on('connection', client => {
		client.on('login', async data => {
			try {
				const { id } = await verifyAccessToken(data.accessToken)
				const userData = await UserModel.findById(id)
				const user = new User(userData, client)

				onlineUsers.add(user)
				client.send('login', { status: 'success' })
			} catch {
				client.send('login', { status: 'failed' })
			}
		})

	})

} 