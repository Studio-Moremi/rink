require('dotenv').config();
const { Client, Intents } = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES] });

const PREFIX = '!';
client.commands = new Map();

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/music/${file}`);
    const command2 = require(`./commands/admin/${file}`)
    client.commands.set(command.name, command, command2);
}

client.once('ready', () => {
    console.log(`${client.user.tag} 봇이 준비되었습니다!`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        const errorEmbed = require('./utils/error')(error);
        message.channel.send({ embeds: [errorEmbed] });
    }
});

client.login(process.env.TOKEN);
