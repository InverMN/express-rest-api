import Bcrypt from 'bcrypt'

export const hashPassword = password => {
	const hashedPassword = Bcrypt.hashSync(password, process.env.PASSWORD_HASH_SALT)

	return hashedPassword
}

export const verifyPassword = (password, hashedPassword) => {
	return Bcrypt.compareSync(password, hashedPassword)
} 