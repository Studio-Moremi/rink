const { MessageEmbed } = require('discord.js');

module.exports = {
    name: '멈춰',
    async execute(message) {
        const channel = message.guild.me.voice.channel;

        if (!channel) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription('봇이 현재 어떤 음성 채팅방에도 들어가 있지 않습니다.');
            return message.channel.send({ embeds: [embed] });
        }

        const connection = message.guild.me.voice.connection;
        if (!connection || !connection.dispatcher) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription('현재 재생 중인 음악이 없습니다!');
            return message.channel.send({ embeds: [embed] });
        }

        try {
            connection.dispatcher.end();
            const embed = new MessageEmbed()
                .setColor('WHITE')
                .setDescription('음악을 멈췄습니다!');
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            throw error;
        }
    },
};
