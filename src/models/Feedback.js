import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	positive: [mongoose.SchemaTypes.ObjectId],
	negative: [mongoose.SchemaTypes.ObjectId]
}

export const Feedback = mongoose.model('Feedback', new Schema(data))