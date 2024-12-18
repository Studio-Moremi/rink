const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '들어가',
    async execute(message) {
        const channel = message.member.voice.channel;

        if (!channel) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription('아직 음성 채팅방에 안 들어가셨군요! 먼저 들어가신 후 명령어를 입력해주세요.');
            return message.channel.send({ embeds: [embed] });
        }

        try {
            await channel.join();
            const embed = new MessageEmbed()
                .setColor('WHITE')
                .setDescription(`음성 채팅방 #${channel.name}에 들어갔어요.`);
            message.channel.send({ embeds: [embed] });
        } catch (error) {
            throw error;
        }
    },
};
