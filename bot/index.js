const { Client, Intents } = require('discord.js');
const { token } = require('../config.json');
const { handle } = require('./message')

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	if (!client.user) return
});

client.on('messageCreate', async (message) => {
	handle(message)
});

// Login to Discord with your client's token
client.login(token);