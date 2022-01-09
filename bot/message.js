
const { generate } = require('../utils/generateAccount')
const { findAcc } = require('../utils/findAcc')
const { transfer } = require('../utils/transfer')

const dotenv = require('dotenv')

dotenv.config()

const prefix = process.env['NODE_ENV'] === 'development' ? 'sol' : '!'

const commands = ['gm', 'transfer', 'generate', 'create', 'help', 'passphrase', 'wallet', 'switch']


async function handle(message) {
	if(!message.content.startsWith(prefix)) return
	const command = message.content.slice(prefix.length).split(' ')[0].toLowerCase()
	
	if (!commands.includes(command)) return
	
	await message.channel.send({ embeds: [{
		title: 'wait for 5s',	
		description: 'sometimes network is slow',
		color: 3092790
	}]})

	try {

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
				await message.author.send({ embeds: [{
					title: 'You need to send ether amount and address❌',	
					description: 'Can"t send ether without address and money',
					color: 3092790
				}]})
				return
			}
		
			// console.log(message.author.id, money, address, passphrase, "SATA")
			let hash = await transfer(message.author.id, money, address, passphrase)
	
			if ('error' in hash) {
				await message.author.send({ embeds: [{
					title: `Transaction Failed😔`,	
					description: "It seems that you have a low balance",
					color: 3092790
				}]})
			}
	
			await message.author.send({ embeds: [{
				...hash,
				title: `Your transaction hash - ${hash.transactionHash}`,	
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
		} else if (command == 'gm') {
			try {
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

			let hash = await transfer(message.author.id, 10000000, address, passphrase)
	
			if ('error' in hash) {
				await message.channel.send({ embeds: [{
					title: `Transaction Failed😔`,	
					description: "It seems that you have a low balance",
					color: 3092790
				}]})
				return
			}
	
			await message.channel.send({ embeds: [{
				...hash,
				title: `Your transaction hash - ${hash.transactionHash}`,	
				description: "Your Wallet",
				color: 3092790
			}]})
		} else {
			await message.channel.send({ embeds: [{
				title: `Command not found`,	
				description: "Your Wallet",
				color: 3092790
			}]})
		}
	} catch (e) {
		console.log(e)
		await message.channel.send({ embeds: [{
			title: `Somethings wrong, I can sense it🤨`,	
			description: "Please raise the issue✋ [Github](https://github.com/sk1122/ETHWallet)",
			color: 3092790
		}]})
	}
}

module.exports = {
	handle
}