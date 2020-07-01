import jsdom from 'jsdom'
import createDOMPurify from 'dompurify'
const { JSDOM } = jsdom

const { window } = new JSDOM('')
const DOMPurity = createDOMPurify(window)

export default function(dirty) {
	return DOMPurity.sanitize(dirty)
}