const { EmbedBuilder } = require('discord.js');

module.exports = (error) => {
    return new MessageEmbed()
        .setColor('RED')
        .setTitle('❗오류가 발생했어요❗')
        .setDescription(`다음과 같은 오류가 발생했습니다:\n${error.message}`);
};
