const { Message, MessageEmbed, Client, WebhookClient } = require('discord.js');

module.exports = {
    name: 'resume',
    description: 'resume the player',
    aliases : ['r'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    async execute(message, client) {
        const { member, guild } = message;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return message.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | You must be in a voice channel To use command !`)]
            }).then(message => setTimeout(() => message.delete(), 5000));

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return message.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redDot')} | I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)]
            }).then(message => setTimeout(() => message.delete(), 5000));

        const queue = client.distube.getQueue(voiceChannel);

        if (!queue) {
            return message.reply({
                embeds: [new MessageEmbed().setColor('ORANGE').setDescription(`**${client.emotes.get('redDot')} | I am not playing any thing !**`)]
            }).then(message => setTimeout(() => message.delete(), 5000));
        };
        try {
            await queue.resume(voiceChannel)
            return message.reply({
                embeds: [new MessageEmbed().setColor('NAVY').setDescription(`**${client.emotes.get('greenDot')} | Resumed !**`)]
            }).then(message => setTimeout(() => message.delete(), 5000));
        } catch (e) {
            const logger = new WebhookClient({ url: 'https://discord.com/api/webhooks/975795668205584394/-ZsTYIH4aePuDIkV7yLONm6mWcR_oZuk6MNASoqsHGyUeafHGhupAKG7qJc3DydX6ZQw' });
            await logger.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] });
            return message.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | You Have already resumed or queue is not resumed !**`),]
            }).then(message => setTimeout(() => message.delete(), 5000));
        };
    },
};