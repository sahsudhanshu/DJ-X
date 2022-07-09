const { Message, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Plays a song',
    aliases: ['p'],
    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client, prefix) {
        const { member, guild, channel } = message;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return message.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | You must be in a voice channel To use command !**`),],
            }).then(msg => setTimeout(() => msg.delete(), 5000));

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return message.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redDot')} | I am already playing music in <#${guild.me.voice.channelId}>**`),]
            }).then(msg => setTimeout(() => msg.delete(), 5000));

        var song = message.content.toLowerCase().split(`${prefix}play `)[1] || message.content.toLowerCase().split(`${prefix}p `)[1];

        if (song == undefined) return message.reply({
            embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | Please enter the song to play it !**`),]
        }).then(msg => setTimeout(() => msg.delete(), 5000));

        client.distube.play(voiceChannel, song, {
            textChannel: channel,
            member: member
        });
        
        return message.reply({
            embeds: [new MessageEmbed().setColor('BLUE').setDescription(`**${client.emotes.get('greenDot')} | ✉ Request Recieved !**`),]
        }).then(msg => setTimeout(() => msg.delete(), 1000));
    },
};