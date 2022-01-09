
const { generate } = require('../utils/generateAccount')
const { findAcc } = require('../utils/findAcc')
const { transfer } = require('../utils/transfer')

const dotenv = require('dotenv')

dotenv.config()

const prefix = process.env['NODE_ENV'] === 'development' ? 'sol' : '!'

const commands = ['gm', 'transfer', 'generate', 'create', 'help', 'reset', 'wallet', 'switch']


async function handle(message) {
	if(!message.content.startsWith(prefix)) return
	const command = message.content.slice(prefix.length).split(' ')[0].toLowerCase()
	
	if (!commands.includes(command)) return
	
	if(command == 'create') {
		try {
			var passphrase = message.content.slice(prefix.length).split(' ')[1].toLowerCase()
		} catch (e) {
			await message.channel.send({ embeds: [{
				title: 'Please send Passphrase to create a wallet',	
				description: 'You need a passphrase to create a secure wallet',
				color: 3092790
			}]})
			return
		}

		let wallet = await generate(passphrase, message.author.id)

		await message.channel.send({ embeds: [{
			title: wallet.title,	
			description: wallet.description,
			color: 3092790
		}]})
	} else if (command == 'transfer') {
		try {
			var money = message.content.slice(prefix.length).split(' ')[1].toLowerCase()
			var address = message.content.slice(prefix.length).split(' ')[2].toLowerCase()
			var passphrase = message.content.slice(prefix.length).split(' ')[3].toLowerCase()
		} catch (e) {
			await message.channel.send({ embeds: [{
				title: 'You need to send ether amount and address❌',	
				description: 'Can"t send ether without address and money',
				color: 3092790
			}]})
			return
		}
		
		let hash = await transfer(message.author.id, money, address, passphrase)
		await message.channel.send({ embeds: [{
			title: `Your transaction hash - ${hash}`,	
			description: "Your Wallet",
			color: 3092790
		}]})
	} else if (command == 'wallet') {
		const wallet = await findAcc(message.author.id)
		
		await message.channel.send({ embeds: [{
			title: `Your wallet address - ${wallet.publicKey}`,	
			description: "Your Wallet",
			color: 3092790
		}]})
	}
}

module.exports = {
	handle
}