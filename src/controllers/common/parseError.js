export function parseError(error) {
	let errorDetails = {}

	if(isMongooseError(error))
		if(isDuplicationError(error))
			errorDetails = parseDuplicationError(error)
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
export const isCustomError = error => {
	if(typeof error === 'string') {
		error = error.trim()
		return error.startsWith('validation') || error.startsWith('auth') || error.startsWith('not found')
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
		
	//If error contains ').' it means that at the end provides "excepted" value, for example minimum length of username is written as (2).
	if(message.endsWith(').') && errorDetails.cause !== 'invalid')
		errorDetails.excepted = parseInt(cutWord(words[14], 1, 2))

	return errorDetails
}

export function parseCustomError(message) {
	const words = message.trim().split(' ')
	const errorDetails = {}
	
	if(words[0].startsWith('validation')) {
		errorDetails.type = 'data validation'
		errorDetails.source = words[2]
		errorDetails.cause = words[1]
		errorDetails.code = 400
	}
	else if(words[0].startsWith('auth')) {
		errorDetails.type = 'authentication'
		errorDetails.cause = 'unauthorized'
		errorDetails.code = 401
		//if starts with "not found" 
	} else if(words[0].startsWith('not')) {
		errorDetails.type = 'not found'
		errorDetails.source = words[2]
		errorDetails.code = 404
	} else {
		errorDetails.type = 'unknown'
		errorDetails.code = 500
	}

	if(words.includes('excepted')){
		errorDetails.excepted = words[4]
		if(!isNaN(parseInt(errorDetails.excepted))) errorDetails.excepted = parseInt(errorDetails.excepted)
	}
	
	return errorDetails
}

//Helper function, cuts provided count of characters from start and end of string
export function cutWord(word, start, end) {
	return word.slice(Math.max(0, start), word.length - Math.max(0, end))
}