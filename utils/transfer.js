const CryptoJS = require('crypto-js');
const Web3 = require('web3');
const web3 = new Web3('wss://eth-rinkeby.alchemyapi.io/v2/lzcVm2ORixzPCjkWxrsSSl3UcL2Eacdy');

const { findAcc } = require('./findAcc')

const transfer = async (userId, ether, to, passphrase) => {
	const wallet = await findAcc(userId)

	const privateKey = CryptoJS.AES.decrypt(wallet.privateKey, passphrase).toString(CryptoJS.enc.Utf8)
	console.log(privateKey)
	let account = await web3.eth.accounts.privateKeyToAccount(privateKey)
	let tx = await web3.eth.accounts.signTransaction({
		to: to,
		value: ether,
		gas: 2000000
	}, privateKey)
	console.log(tx)
	return tx.messageHash
}

module.exports = {
	transfer
}