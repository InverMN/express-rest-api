export class OnlineUsers {
	constructor() {
		this.users = {}
	}

	add(newUser) {
		const userId = String(newUser.data._id)
		this.users[userId] = newUser
	}

	get(userId) {
		return this.users[userId]
	}

	remove(userId) {
		delete this.users[userId]
	}
}