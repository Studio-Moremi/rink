const ytdl = require('ytdl-core');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '틀어',
    async execute(message, args) {
        const channel = message.member.voice.channel;

        if (!channel) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription('음성 채팅방에 들어가신 후 명령어를 입력해주세요!');
            return message.channel.send({ embeds: [embed] });
        }

        const query = args.join(' ');
        if (!query) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .setDescription('음악 이름을 입력해주세요!');
            return message.channel.send({ embeds: [embed] });
        }

        try {
            const connection = await channel.join();
            const stream = ytdl(query, { filter: 'audioonly' });
            const dispatcher = connection.play(stream);

            dispatcher.on('start', () => {
                const embed = new MessageEmbed()
                    .setColor('WHITE')
                    .setDescription(`🎶 재생 중: ${query}`);
                message.channel.send({ embeds: [embed] });
            });

            dispatcher.on('finish', () => {
                channel.leave();
            });
        } catch (error) {
            throw error;
        }
    },
};
