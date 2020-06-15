const mongoose = require('mongoose')
const Schema = mongoose.Schema

const data = {
	username: String,
	hashedPassword: String,
	email: String
}

module.exports = mongoose.model('user', new Schema(data))