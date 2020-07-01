import jsdom from 'jsdom'
import createDOMPurify from 'dompurify'
const { JSDOM } = jsdom

const { window } = new JSDOM('')
const DOMPurity = createDOMPurify(window)

export function sanitize(dirty) {
	return DOMPurity.sanitize(dirty)
}