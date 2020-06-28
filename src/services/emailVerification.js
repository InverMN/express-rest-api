import { generateEmailConfirmationToken } from '../services/jwt.js'
import nodemailer from 'nodemailer'

let lazyTransport = null

export async function createConfirmationTransport() {
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
}

export async function sendConfirmationEmail(userId, email) {
	const emailToken = await generateEmailConfirmationToken(userId)
	const url = `http://${process.env.ADDRESS}/confirm/${emailToken}`

	if(lazyTransport === null) lazyTransport = await createConfirmationTransport()

	lazyTransport.sendMail({
		to: email,
		html: `Please click <a href="${url}">this link</a> to confirm your e-mail.`
	}).then( info => {
		console.log('verify email message:', nodemailer.getTestMessageUrl(info))
	})
}