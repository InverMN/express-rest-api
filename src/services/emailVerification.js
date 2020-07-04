import { generateEmailConfirmationToken } from '../services/jwt.js'
import nodemailer from 'nodemailer'

let lazyTransport = null

export async function createConfirmationTransport() {
	if(process.env.MODE === 'development') {
		let testAccount = await nodemailer.createTestAccount()
		
		const transportOptions = {
			host: 'smtp.ethereal.email', 
			port: 587,
			secure: false,
			auth: {
				user: testAccount.user, 
				pass: testAccount.pass
			}
		}
	
		const emailDefaults = {
			from: 'dev@example.com',
			subject: 'Confirm Email ✔'
		}
	
		return nodemailer.createTransport(transportOptions, emailDefaults)
	} else {
		const transportOptions = {
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USER, 
				pass: process.env.EMAIL_PASSWORD
			}
		}

		const emailDefaults = {
			from: 'dev@example.com',
			subject: 'Confirm Email ✔'
		}

		return nodemailer.createTransport(transportOptions, emailDefaults)
	}
}

export async function sendConfirmationEmail(userId, email) {
	const emailToken = await generateEmailConfirmationToken(userId)
	const url = `http://${process.env.ADDRESS}/api/v1//confirm/${emailToken}`

	if(lazyTransport === null) lazyTransport = await createConfirmationTransport()

	const info = await lazyTransport.sendMail({
		to: email,
		html: `Please click <a href="${url}">this link</a> to confirm your e-mail.`
	})

	if(process.env.MODE === 'development')
		console.log('verify email message:', nodemailer.getTestMessageUrl(info))
	else if(process.env.MODE === 'test')
		return url
}