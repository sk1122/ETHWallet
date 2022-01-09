const CryptoJS = require('crypto-js');
const Web3 = require('web3');
const web3 = new Web3('https://eth-rinkeby.alchemyapi.io/v2/lzcVm2ORixzPCjkWxrsSSl3UcL2Eacdy');

const { findAcc } = require('./findAcc')

const transfer = async (userId, ether, to, passphrase) => {
	const wallet = await findAcc(userId)

	console.log(JSON.stringify(wallet.privateKey))

	let account = await web3.eth.accounts.decrypt(wallet.privateKey, passphrase)

	let tx = await web3.eth.accounts.signTransaction({
		to: to,
		value: ether,
		gas: 2000000
	}, account.privateKey)
	
	try {
		var transaction = await web3.eth.sendSignedTransaction(tx.rawTransaction)
	} catch (e) {
		return { error: "Account Doesn't have that much balance, for god's sake earn some crypto" }
	}

	return transaction
}

module.exports = {
	transfer
}