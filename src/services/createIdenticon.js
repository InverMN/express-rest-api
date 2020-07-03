import Files from 'fs'
import Avatar from 'avatar-builder'

export async function createIdenticon(userId) {
	const builder = Avatar.identiconBuilder(256)
	const identicon = await builder.create(userId)
	Files.writeFileSync(`public/avatars/${userId}.png`, identicon)
}