import Files from 'fs'
import Avatar from 'avatar-builder'

export async function createIdenticon(userId) {
	{
		const builder = Avatar.identiconBuilder(256)
		const identicon = await builder.create(userId)
		Files.writeFileSync(`public/avatars/medium/${userId}.png`, identicon)
	}
	{
		//create 64x64 version of the same identicon
		const builder = Avatar.identiconBuilder(256)
		const identicon = await builder.create(userId)
		Files.writeFileSync(`public/avatars/low/${userId}.png`, identicon)
	}
}