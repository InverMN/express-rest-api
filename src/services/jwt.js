import JWT from 'jsonwebtoken'

export const generateAccessToken = userId => {
	return JWT.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

export const generateRefreshToken = userId => {
	return JWT.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET)
}

export const verifyAccessToken = async token => {
	return await JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

export const verifyRefreshToken = async token => {
	return await JWT.verify(token, process.env.REFRESH_TOKEN_SECRET)
}