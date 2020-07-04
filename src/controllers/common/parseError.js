export function parseError(error) {
	let errorDetails = {}

	if(isMongooseError(error))
		if(isDuplicationError(error))
			errorDetails = parseDuplicationError(error)
		else if(isCastError(error))
			errorDetails = parseCastError()
		else
			errorDetails = parseInvalidationError(error)
	else if(isCustomError(error))
		errorDetails = parseCustomError(error)
	else
		errorDetails = { type: 'unknown', code: 500 }

	return { error: errorDetails }
}

//Checkers for the error type, which help decide what parser to use
export const isMongooseError = error => typeof error === 'object' && error.message !== undefined
export const isDuplicationError = error => error.code === 11000
export const isCastError = error => error.kind === 'ObjectId'
export const isCustomError = error => {
	if(typeof error === 'string') {
		error = error.trim()
		return error.startsWith('unauthenticated') 
			|| error.startsWith('forbidden') 
			|| error.startsWith('missing')
			|| error.startsWith('short')
			|| error.startsWith('long')
			|| error.startsWith('incorrect')
			|| error.startsWith('not') // not found
	} else
		return false
}

//True parsers to extract details from error
export const parseDuplicationError = ({ message }) => ({
	//Take 8th word, which defines the duplicated property (for example 'name_1'), nextly cut its tail and set it as source  
	type: 'data validation',
	source: cutWord(message.split(' ')[7], 0, 2),
	cause: 'duplicate',
	code: 400
})

export const parseCastError = () => ({ 
	type: 'data validation',
	source: 'id', 
	cause: 'incorrect',
	code: 400
})

//Helper object to decide of error 'cause' in 'invalid' error type. Used to be iterated on
const causesWithResponds = {
	'shorter': 'short',
	'longer': 'long',
	'required.': 'missing',
	'invalid': 'invalid'
}

export function parseInvalidationError({ message }) {
	const words = message.split(' ')

	//Use helper object to iterate on and choose correct 'cause' output for error details based on specific word in error message
	let cause
	for(const identifier in causesWithResponds) 
		if(words.includes(identifier))
			cause = causesWithResponds[identifier]
	
	const errorDetails = {
		type: 'data validation',
		source: cutWord(words[3], 0, 1),
		cause,
		code: 400
	}
		
	//If error contains ').' it means that at the end provides "expected" value, for example minimum length of username is written as (2).
	if(message.endsWith(').') && errorDetails.cause !== 'invalid')
		errorDetails.expected = parseInt(cutWord(words[14], 1, 2))

	return errorDetails
}

export function parseCustomError(message) {
	const words = message.trim().split(' ')
	let errorDetails

	switch(words[0]) {
		case 'unauthenticated':
			errorDetails = {
				type: 'authorization',
				cause: 'unauthenticated',
				code: 401
			}
			break
		case 'forbidden':
			errorDetails = {
				type: 'authorization',
				cause: 'forbidden',
				expected: words[2],
				code: 403
			}
			break
		case 'missing':
			errorDetails = {
				type: 'data validation',
				source: words[1],
				cause: 'missing',
				code: 400
			}
			break
		case 'short':
			errorDetails = {
				type: 'data validation',
				source: words[1],
				cause: 'short',
				expected: parseInt(words[3]),
				code: 400
			}
			break
		case 'long':
			errorDetails = {
				type: 'data validation',
				source: words[1],
				cause: 'long',
				expected: parseInt(words[3]),
				code: 400
			}
			break
		case 'incorrect':
			errorDetails = {
				type: 'authentication',
				source: words[1],
				cause: 'incorrect',
				code: 400
			}
			break
		case 'not':
			errorDetails = {
				type: 'not found',
				source: words[2],
				code: 404
			}
			break
		default: 
			errorDetails = {
				type: 'unknown',
				code: 500
			}
	}
	
	return errorDetails
}

//Helper function, cuts provided count of characters from start and end of string
export function cutWord(word, start, end) {
	return word.slice(Math.max(0, start), word.length - Math.max(0, end))
}