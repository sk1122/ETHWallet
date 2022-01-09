const CryptoJS = require('crypto-js');
const Web3 = require('web3');
const web3 = new Web3('wss://eth-rinkeby.alchemyapi.io/v2/lzcVm2ORixzPCjkWxrsSSl3UcL2Eacdy');
const fetch = require('cross-fetch')

const generate = async (passphrase, userid) => {
	let account = await web3.eth.accounts.create()

	var encrypted = CryptoJS.AES.encrypt(account.privateKey, passphrase).toString()
	
	let data = await fetch('http://localhost:3000/api/create', {
		method: 'POST',
		body: JSON.stringify({
			publicKey: account.address,
			encryptedPrivateKey: encrypted,
			userId: userid
		})
	})

	let json = await data.json()

	return json
}

module.exports = {
	generate,
}