const Web3 = require('web3');
const web3 = new Web3('https://eth-rinkeby.alchemyapi.io/v2/lzcVm2ORixzPCjkWxrsSSl3UcL2Eacdy');
const fetch = require('cross-fetch')

const generate = async (passphrase, userid) => {
	let account = await web3.eth.accounts.create()
	let encryptedJSON = await web3.eth.accounts.encrypt(account.privateKey, passphrase)

	let data = await fetch('http://localhost:3000/api/create', {
		method: 'POST',
		body: JSON.stringify({
			publicKey: account.address,
			encryptedPrivateKey: JSON.stringify(encryptedJSON),
			userId: userid
		})
	})

	let json = await data.json()

	return json
}

module.exports = {
	generate,
}