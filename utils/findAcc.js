const fetch = require('cross-fetch')

async function findAcc(userId) {
	let data = await fetch('http://localhost:3000/api/get', {
		method: 'POST', 
		body: JSON.stringify({
			userId: userId
		})
	})
	let json = await data.json()

	return json
} 

module.exports = {
	findAcc
}