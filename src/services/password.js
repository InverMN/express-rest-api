import Bcrypt from 'bcrypt'

export const hashPassword = password => {
	return Bcrypt.hashSync(password, process.env.PASSWORD_HASH_SALT)
}

export const verifyPassword = (password, hashedPassword) => {
	return Bcrypt.compareSync(password, hashedPassword)
} 