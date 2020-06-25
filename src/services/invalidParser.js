function cutWord(word, start, end) {
	return word.split('').reverse().splice(end - word.length).reverse().splice(start + 1 - word.length).join('')
}


const causesWithResponds = {
	'is shorter': 'short',
	'is longer': 'long',
	'required': 'missing',
	'invalid': 'invalid'
}

function isNativeMongoError(error) {
	if(error.message) return true
	return error.startsWith('E11000') ||
	error.includes('validation failed')
}

function parseNativeMongoError(errorString) {
	if(errorString.startsWith('E11000')) {
		return {
				source: cutWord(errorString.split(' ')[7], 0, 2),
				cause: 'duplicate'
			}
	} else {	
		let cause
		for(const identifier in causesWithResponds) 
		if(errorString.includes(identifier))
		cause = causesWithResponds[identifier]
		
		const errorObject = {
			source: cutWord(errorString.split(' ')[3], 0, 1),
			cause
		}
		
		if(errorString.endsWith(').'))
		errorObject.excepted = parseInt(cutWord(errorString.split(' ')[14], 2, 2))
		
		return errorObject
	}
}


function isCustomError(error) {
	return error.startsWith('long') ||
		error.startsWith('short') ||
		error.startsWith('incorrect') ||
		error.startsWith('invalid') ||
		error.startsWith('missing')
}

function parseCustomError(errorString) {
	const errorObject = {}
	errorObject.source = errorString.split(' ')[1]
	errorObject.cause = errorString.split(' ')[0]
	
	if(errorString.includes('excepted'))
	errorObject.excepted = errorString.split(' ')[3]
	
	return errorObject
}


export default function(error) {
	let errorObject = {}
	if(isNativeMongoError(error)) 
		errorObject = parseNativeMongoError(error)
	else if(isCustomError(error))
		errorObject = parseCustomError(error)
	else
		errorObject = { source: 'unknown' }

	return {
		error: {
			type: 'data validation',
			...errorObject
		}
	}
}