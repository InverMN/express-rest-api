import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	body: String
}

export const Token = mongoose.model('Token', new Schema(data))