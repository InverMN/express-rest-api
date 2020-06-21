import mongoose from 'mongoose'
const Schema = mongoose.Schema

const data = {
	body: String
}

export default mongoose.model('Token', new Schema(data))