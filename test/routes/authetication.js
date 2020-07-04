import requester from '../index.js'
import chai from 'chai'
const { expect } = chai

describe('Authentication', () => {
	let accessToken
	let refreshToken 
	let emailVerificationURL

	describe('/register', () => {
		it('Try to register new user without any data', done => {
			const requestBody = {}
			const expectedBody = {
				error: { 
					type: 'data validation', 
					source: 'password', 
					cause: 'missing',
					code: 400 
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})
		it('Try to register new user without username', done => {
			const requestBody = {
				email: 'test@example.com',
				password: 'qwaszx'
			}
			const expectedBody = {
				error: { 
					type: 'data validation', 
					source: 'username', 
					cause: 'missing',
					code: 400 
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})
		it('Try to register new user without e-mail', done => {
			const requestBody = {
				username: 'MasterNija',
				password: 'qwaszx'
			}
			const expectedBody = {
				error: { 
					type: 'data validation', 
					source: 'email', 
					cause: 'missing',
					code: 400 
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})
		it('Try to register new user without password', done => {
			const requestBody = {
				username: 'MasterNija',
				email: 'test@example.com'
			}
			const expectedBody = {
				error: { 
					type: 'data validation', 
					source: 'password', 
					cause: 'missing',
					code: 400 
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})
		it('Try to register new user with too long username', done => {
			const requestBody = {
				username: 'xXXXx_MasterNija_xXXXx',
				email: 'test@example.com',
				password: 'qwaszx'
			}
			const expectedBody = {
				error: { 
					type: 'data validation', 
					source: 'username', 
					cause: 'long',
					expected: 16, 
					code: 400 
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})

		it('Try to register new user with too short username', done => {
			const requestBody = {
				username: 'V',
				email: 'test@example.com',
				password: 'qwaszx'
			}
			const expectedBody = {
				error: { 
					type: 'data validation', 
					source: 'username', 
					cause: 'short',
					expected: 2, 
					code: 400 
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})

		it('Try to register new user with invalid e-mail', done => {
			const requestBody = {
				username: 'MasterNija',
				email: 'example.com',
				password: 'qwaszx'
			}
			const expectedBody = {
				error: { 
					type: 'data validation', 
					source: 'email', 
					cause: 'invalid', 
					code: 400 
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})

		it('Register new user', done => {
			const requestBody = {
				username: 'MasterNija',
				email: 'test@example.com',
				password: 'qwaszx'
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res).to.have.status(200)
					expect(res).to.be.json
					expect(res.body).to.have.keys('accessToken', 'emailVerificationURL', 'refreshToken')

					accessToken = res.body.accessToken
					refreshToken = res.body.refreshToken
					emailVerificationURL = res.body.emailVerificationURL

					done()
				})
		})

		it('Try to register the same user second time', done => {
			const requestBody = {
				username: 'MasterNija',
				email: 'test@example.com',
				password: 'qwaszx'
			}
			const expectedBody = {
				error: { 
					type: 'data validation', 
					source: 'username', 
					cause: 'duplicate', 
					code: 400 
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})
	
		it('Try to register new user with the same e-mail', done => {
			const requestBody = {
				username: 'AnotherUserNick',
				email: 'test@example.com',
				password: 'qwaszx'
			}
			const expectedBody = {
				error: { 
					type: 'data validation', 
					source: 'email', 
					cause: 'duplicate', 
					code: 400 
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})
	
		it('Try to register new user with the same username', done => {
			const requestBody = {
				username: 'MasterNija',
				email: 'another@example.com',
				password: 'qwaszx'
			}
			const expectedBody = {
				error: {
					type: 'data validation',
					source: 'username', 
					cause: 'duplicate',
					code: 400
				}
			}
			requester
				.post('/api/v1/register')
				.send(requestBody)
				.end((err, res) => {
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})
	})

	describe('/confirm', () => {
		it('Pass empty confirmation token', done => {
			const expectedBody = {}
			requester
				.get('/api/v1/confirm')
				.end((err, res) => {
					expect(res).to.have.status(404)
					expect(res.body).to.deep.equal({})
					done()
				})
		})

		it('Pass invalid confirmation token', done => {
			const expectedBody = {
				error: {
					type: 'data validation',
					source: 'token',
					cause: 'invalid',
					code: 400
				}
			}
			requester
				.get('/api/v1/confirm/asdasdaa2da2d2adsda.sdasdas2daw2dasd.sASa2d2adDa')
				.end((err, res) => {
					expect(res).to.have.status(400)
					expect(res.body).to.deep.equal(expectedBody)
					done()
				})
		})

		it('Pass correct confirmation token', done => {
			requester
				.get(emailVerificationURL.slice(emailVerificationURL.indexOf('/api/v1'), emailVerificationURL.length))
				.end((err, res) => {
					expect(res).to.have.status(200)
					expect(res.body).to.have.keys('accessToken', 'refreshToken')

					accessToken = res.body.accessToken
					refreshToken = res.body.refreshToken

					done()
				})
		})
	})
})