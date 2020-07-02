import { parseError } from './index.js'

export function handleError(response, error) {
	const parsedError = parseError(error)
	response.status(parsedError.error.code)
	response.send(parsedError)
}