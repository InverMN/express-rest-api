import { sanitize } from '../../services/index.js'

export function update(document, data, properties) {
	properties.forEach(property => {
		if(property in data) 
			document[property] = sanitize(data[property])
	})
}