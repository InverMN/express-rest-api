import mongoose from 'mongoose'
import { email } from '../patterns.js'
import Avatar from 'avatar-builder'
import fs from 'fs'
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
	}
}

const schema = new Schema(data)

//Create and export model
export const User = mongoose.model('user', schema)