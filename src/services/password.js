import Bcrypt from 'bcrypt'

export const hashPassword = password => {
	const salt = Bcrypt.genSaltSync(10)
	const hashedPassword = Bcrypt.hashSync(password, salt)

	return hashedPassword
}

export const verifyPassword = (password, hashedPassword) => {
	return Bcrypt.compareSync(password, hashedPassword)
} 