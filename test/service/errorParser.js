import { cutWord, isNativeMongoError, isDuplicationError, isCustomError, parseDuplicationError, parseInvalidationError, parseCustomError } from '../../src/services/errorParser.js'
import chai from 'chai'
const assert = chai.assert

describe('Error Parser', () => {
	describe('Helper Functions', () => {
		describe('cutWord()', () => {
			it('Do not cut anything', done => {
				assert.equal(cutWord('test', 0, 0), 'test')
				done()
			})
			it('Cut 2 last characters', done => {
				assert.equal(cutWord('test', 0, 2), 'te')
				done()
			})
			it('Cut first character', done => {
				assert.equal(cutWord('test', 1, 0), 'est')
				done()
			})
			it('Cut 2 characters, one at beginning and one end', done => {
				assert.equal(cutWord('test', 1, 1), 'es')
				done()
			})
			it('Interpret negative numbers as zero', done => {
				assert.equal(cutWord('test', -2, -32), 'test')
				done()
			})
		})
	})
	describe('Checkers', () => {
		describe('isNativeMongoError()', () => {
			it('Successfully return true invoking on object with "message" property', done => {
				assert.equal(isNativeMongoError({ message: 'test' }), true)
				done()
			})
			it('Return false when invoking on object without "message" property', done => {
				assert.equal(isNativeMongoError({ other: 'filler' }), false)
				done()
			})
			it('Return false when invoking on string, number and without argument', done => {
				assert.equal(isNativeMongoError('test'), false)
				assert.equal(isNativeMongoError(1212), false)
				assert.equal(isNativeMongoError(), false)
				done()
			})
		})
		describe('isDuplicationError()', () => {
			it('Successfully run on error', done => {
				assert.equal(isDuplicationError({ message: 'E11000 test' }), true)
				done()
			})
			it('Fail on error without "E11000"', done => {
				assert.equal(isDuplicationError({ message: 'test' }), false)
				done()
			})
		})
		describe('isCustomError()', () => {
			it('Successfully run on error', done => {
				assert.equal(isCustomError('invalid password'), true)
				assert.equal(isCustomError('long password'), true)
				assert.equal(isCustomError('short password excepted 3'), true)
				assert.equal(isCustomError('incorrect password'), true)
				assert.equal(isCustomError('missing password'), true)
				done()
			})
			it('Fail on error without correct prefix', done => {
				assert.equal(isCustomError('too long password'), false)
				assert.equal(isCustomError('missed password'), false)
				assert.equal(isCustomError(22213), false)
				assert.equal(isCustomError(), false)
				assert.equal(isCustomError({ test: 'test' }), false)
				done()
			})
		})
	})
	describe('Parsers', () => {
		describe('parseDuplicationError()', () => {
			it('Extract duplicated property name', done => {
				chai.expect(parseDuplicationError({ message: 'E11000 duplicate key error collection: blog.users index: username_1 dup key: { : "Inver" }'})).to.deep.equal({ source: 'username', cause: 'duplicate' })
				done()
			})
		})
		describe('parseInvalidationError()', () => {
			it('Parse "too short" invalidation error', done => {
				chai.expect(parseInvalidationError({ message: 'user validation failed: username: Path `username` (`I`) is shorter than the minimum allowed length (2).'})).to.deep.equal({ source: 'username', cause: 'short', excepted: 2 })
				done()
			})
			it('Parse "too long" invalidation error', done => {
				chai.expect(parseInvalidationError({ message: 'user validation failed: username: Path `username` (`Loooooooooooooooooooooooooooooooooooong`) is longer than the maximum allowed length (16).'})).to.deep.equal({ source: 'username', cause: 'long', excepted: 16 })
				done()
			})
			it('Parse "missing" invalidation error', done => {
				chai.expect(parseInvalidationError({ message: 'user validation failed: username: Path `username` is required.'})).to.deep.equal({ source: 'username', cause: 'missing' })
				done()
			})
			it('Parse "invalid" invalidation error', done => {
				chai.expect(parseInvalidationError({ message: 'user validation failed: email: Path `email` is invalid (asdsad.asdasd.asd)., username: Path `username` (`asddddddddddddasdasd`) is longer than the maximum allowed length (16).'})).to.deep.equal({ source: 'email', cause: 'invalid' })
				done()
			})
		})
		describe('parseCustomError()', () => {
			it('Parse "missing password" error', done => {
				chai.expect(parseCustomError('missing password')).to.deep.equal({ source: 'password', cause: 'missing' })
				done()
			})
			it('Parse "short password excepted 6" error', done => {
				chai.expect(parseCustomError('short password excepted 6')).to.deep.equal({ source: 'password', cause: 'short', excepted: 6 })
				done()
			})
			it('Parse "long password excepted 256" error', done => {
				chai.expect(parseCustomError('long password excepted 256')).to.deep.equal({ source: 'password', cause: 'long', excepted: 256 })
				done()
			})
			it('Parse "incorrect password" error', done => {
				chai.expect(parseCustomError('incorrect password')).to.deep.equal({ source: 'password', cause: 'incorrect' })
				done()
			})
			it('Parse "invalid password" error', done => {
				chai.expect(parseCustomError('invalid password')).to.deep.equal({ source: 'password', cause: 'invalid' })
				done()
			})
		})
	})
})