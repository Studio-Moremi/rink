require('dotenv').config(); // .env 환경 변수 로드
const { MessageEmbed } = require('discord.js');
const { getWarnings, updateWarnings } = require('../../utils/db');
const _ = require('lodash'); // 데이터 핸들링
const moment = require('moment'); // 시간 핸들링
const chalk = require('chalk');
const debug = require('debug')('app:warn'); // 디버깅 로그
const validator = require('validator'); // 입력값 검증

module.exports = {
    name: '경고',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        debug('경고 명령 실행 요청 수신');

        if (!message.member.permissions.has('MANAGE_GUILD')) {
            const errorMsg = '이 명령어를 사용할 권한이 없습니다!';
            debug(chalk.red(errorMsg));
            return message.channel.send(errorMsg);
        }

        const target = message.mentions.members.first();
        if (!target) {
            const errorMsg = '경고를 줄 대상을 멘션해주세요!';
            debug(chalk.yellow(errorMsg));
            return message.channel.send(errorMsg);
        }

        const warningCount = parseInt(args[1], 10);
        if (!validator.isInt(args[1]) || warningCount <= 0) {
            const errorMsg = '유효한 경고 수를 입력해주세요! (양수)';
            debug(chalk.yellow(errorMsg));
            return message.channel.send(errorMsg);
        }

        const reason = args.slice(2).join(' ') || '사유 없음';
        debug(chalk.blueBright(`경고 사유: ${reason}`));

        try {
            await updateWarnings(target.id, warningCount);
            const totalWarnings = await getWarnings(target.id);

            const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
            debug(chalk.green(`경고 처리 완료 - ${timestamp}`));

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`${target}의 경고 처리`)
                .addField('관리자', `${message.author}`, true)
                .addField('이용자', `${target}`, true)
                .setDescription(`경고 이유: **${warningCount}** | **${reason}**`)
                .setFooter(`누적 경고 수: ${totalWarnings}`, message.author.displayAvatarURL())
                .setTimestamp();

            message.channel.send({ embeds: [embed] });
            debug(chalk.green('임베드 메시지 전송 완료'));
        } catch (error) {
            debug(chalk.red('경고 처리 중 오류 발생:', error.message));
            const errorEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('❗ 오류 발생 ❗')
                .setDescription('다음과 같은 오류가 발생했습니다:\n```' + error.message + '```');
            message.channel.send({ embeds: [errorEmbed] });
        }
    },
};
