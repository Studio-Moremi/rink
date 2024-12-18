const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '나가',
    async execute(message) {
        const channel = message.guild.me.voice.channel;

        if (!channel) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription('이미 나가져 있는 상태에요!');
            return message.channel.send({ embeds: [embed] });
        }

        try {
            await channel.leave();
            const embed = new MessageEmbed()
                .setColor('WHITE')
                .setDescription('음성방에서 나갔어요!');
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            throw error;
        }
    },
};
