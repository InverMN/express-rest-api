export class OnlineUsers {
	constructor() {
		this.users = []
	}

	add(newUser) {
		this.users.push(newUser)
	}

	get(userId) {
		return this.users.find(user => user.id === userId)
	}

	remove(userId) {
		this.users = this.users.filter(user => user.id !== userId)
	}
}