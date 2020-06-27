//Helper function, cuts provided count of characters from start and end of string
export function cutWord(word, start, end) {
	if(start < 0) start = 0
	if(end < 0) end = 0
	return word.slice(start, word.length - end)
}

//Helper object to decide of error 'cause' in 'invalid' error type. Used to be iterated on
const causesWithResponds = {
	'shorter': 'short',
	'longer': 'long',
	'required.': 'missing',
	'invalid': 'invalid'
}

//Checkers for the error type, which help decide what parser to use
export const isNativeMongoError = error => { 
	if(error === undefined) return false
	return error.message !== undefined
}
export const isDuplicationError = error => error.message.startsWith('E11000')
export const isCustomError = error => {
	if(typeof error !== 'string') return false

	return error.startsWith('long') ||
		error.startsWith('short') ||
		error.startsWith('incorrect') ||
		error.startsWith('invalid') ||
		error.startsWith('missing')
} 


//True parsers to extract details from error
export function parseDuplicationError({ message }) {
	return {
		//Take 8th word, which defines the duplicated property (for example 'name_1'), nextly cut its 'tail' and set it as source  
		source: cutWord(message.split(' ')[7], 0, 2),
		cause: 'duplicate'
	}
}

export function parseInvalidationError({ message }) {
	const words = message.split(' ')

	//Use helper object to iterate on and choose correct 'cause' output for error details based on specific word in error message
	let cause
	for(const identifier in causesWithResponds) 
		if(words.includes(identifier))
			cause = causesWithResponds[identifier]
	
	const errorDetails = {
		source: cutWord(words[3], 0, 1),
		cause
	}
		
	//If error contains ').' it means that at the end provides "excepted" value, for example minimum length of username is written as (2).
	if(message.endsWith(').') && errorDetails.cause !== 'invalid')
		errorDetails.excepted = parseInt(cutWord(words[14], 1, 2))

	return errorDetails
}

export function parseCustomError(message) {
	const words = message.split(' ')
	const errorDetails = {}

	errorDetails.source = words[1]
	errorDetails.cause = words[0]
	
	if(words.includes('excepted')){
		errorDetails.excepted = words[3]
		if(!isNaN(parseInt(errorDetails.excepted))) errorDetails.excepted = parseInt(errorDetails.excepted)
	}
	
	return errorDetails
}

//All merged together to one main full-functional function
export default function(error) {
	let errorDetails = {}

	if(isNativeMongoError(error)) 
		if(isDuplicationError(error))
			errorDetails = parseDuplicationError(error)
		else
			errorDetails = parseInvalidationError(error)
	else if(isCustomError(error))
		errorDetails = parseCustomError(error)
	else
		errorDetails = { source: 'unknown' }

	return {
		error: {
			type: 'data validation',
			...errorDetails
		}
	}
}