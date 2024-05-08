const Discord = require('discord.js');
const client = new Discord.Client({ intents: [ /* Add your intents here */ ] });
const { prefix, token } = require('./config.json');

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('message', message => {
    console.log(`Message received: ${message.content}`); // Log the received message

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    console.log(`Command: ${command}, Arguments: ${args}`); // Log the parsed command and arguments

    if (command === 'clean') {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            console.log(`User ${message.author.tag} tried to use 'clean' command without permission.`); // Log unauthorized command usage
            return message.reply("You don't have permission to use this command.");
        }

        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            console.log(`User ${message.author.tag} provided invalid amount for 'clean' command: ${args[0]}`); // Log invalid command usage
            return message.reply('Please provide a valid number of messages to delete.');
        } else if (amount <= 1 || amount > 100) {
            console.log(`User ${message.author.tag} tried to delete invalid amount of messages: ${amount}`); // Log invalid amount of messages
            return message.reply('You can only delete between 1 and 99 messages at once.');
        }

        message.channel.bulkDelete(amount, true)
            .then(deletedMessages => {
                console.log(`Deleted ${deletedMessages.size - 1} messages in ${message.channel.name}`); // Log successful message deletion
                message.channel.send(`Deleted ${deletedMessages.size - 1} messages.`);
            })
            .catch(error => {
                console.error('Error deleting messages:', error);
                message.channel.send('An error occurred while deleting messages.');
            });
    }
});

client.login(token);
