export class User {
	constructor(userData, socket) {
		this.id = userData._id
		this.data = userData
		this.socket = socket
	}
}