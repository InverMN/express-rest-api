import createSocket from 'socket.io'
import { OnlineUsers, User } from './index.js'
import { verifyAccessToken } from '../services/index.js'
import { User as UserModel } from '../models/index.js'

export class Server {
	constructor(httpServer) {
		const server = createSocket(httpServer)
		const onlineUsers = new OnlineUsers()
	
		server.on('connection', client => {
			client.on('login', async data => {
				try {
					const { id } = await verifyAccessToken(data.accessToken)
					const userData = await UserModel.findById(id)
					const user = new User(userData, client)
	
					onlineUsers.add(user)
					client.emit('login', { status: 'success' })
					
					client.on('disconnect', () => onlineUsers.remove(id))
					client.on('logout', () => onlineUsers.remove(id))
				} catch {
					client.emit('login', { status: 'failed' })
				}
			})
		})

		this.serverSocket = server
		this.onlineUsers = onlineUsers
	}

	sendNotification(notificationDocument) {
		const user = this.onlineUsers.get(notificationDocument.receiver.id)
		if(user === undefined) return
		else user.socket.emit('notification', notificationDocument)
	}
}

export let server

export function createSocketServer(httpServer) {
	server = new Server(httpServer)
}