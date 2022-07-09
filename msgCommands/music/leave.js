const { MessageEmbed, Client, Message } = require('discord.js');

module.exports = {
    name: 'leave',
    description: 'leave the voice channel',
    aliases: ['l'],
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
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | You must be in a voice channel To use command !**`)]
            }).then(msg => setTimeout(() => msg.delete(), 5000));

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return message.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redDot')} | I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)]
            }).then(msg => setTimeout(() => msg.delete(), 5000));

        try {
            await client.distube.voices.leave(voiceChannel);
            await message.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | DISCONNECTED**`)]
            }).then(msg => setTimeout(() => msg.delete(), 5000));
        } catch (e) {
            const logger = new WebhookClient({ url: 'https://discord.com/api/webhooks/975795668205584394/-ZsTYIH4aePuDIkV7yLONm6mWcR_oZuk6MNASoqsHGyUeafHGhupAKG7qJc3DydX6ZQw' });
            await logger.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] });
            return message.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} I have not joined any channel**`),],
            }).then(msg => setTimeout(() => msg.delete(), 5000));
        };
    },
};