function cutWord(word, start, end) {
	return word.split('').reverse().splice(end - word.length).reverse().splice(start + 1 - word.length).join('')
}

const causesWithResponds = {
	'is shorter': 'too short',
	'is longer': 'too long',
	'required': 'required'
}

export default function(error) {
	if(error.startsWith('E11000')) {
		return {
			source: cutWord(error.split(' ')[7], 0, 2),
			cause: 'duplicate'
		}
	} else {
		let cause
		for(const identifier in causesWithResponds) 
			if(error.includes(identifier))
				cause = causesWithResponds[identifier]
		

		const response = {
			source: cutWord(error.split(' ')[3], 0, 1),
			cause
		}

		if(error.endsWith(').'))
			response.excepted = parseInt(cutWord(error.split(' ')[14], 2, 2))

		return response
	}
}