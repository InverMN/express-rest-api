import mongoose from 'mongoose'
import { email } from '../patterns.js'
const Schema = mongoose.Schema

//Declare schema
const data = {
	username: {
		type: String,
		required: true,
		unique: true,
		minlength: 2,
		maxlength: 16,
		trim: true
	},
	hashedPassword: {
		type: String,
		required: true
	}, 
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		match: email
	},
	isVerified: {
		type: Boolean,
		default: false
	},
	isModerator: { 
		type: Boolean,
		default: false
	},
	avatar: {
		type: String
	}
}

const schema = new Schema(data)

//Add middleware
//Create avatar image path from document's id
schema.pre('save', function() {
	this.avatar = `${process.env.PATH}/static/avatars/${this._id}.webp`
})

//Create and export model
export const User = mongoose.model('user', schema)