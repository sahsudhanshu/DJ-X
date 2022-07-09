const { Message, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: 'volume',
    description: 'manages the volume of player',
    aliases: ['v'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    async execute(message, client, prefix) {
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

        const queue = client.distube.getQueue(voiceChannel);

        if (!queue) {
            return message.reply({
                embeds: [new MessageEmbed().setColor('ORANGE').setDescription(`**${client.emotes.get('redDot')} I am not playing any thing !**`)]
            }).then(msg => setTimeout(() => msg.delete(), 5000));
        };
        try {
            const volume = message.content.split(`${prefix}volume `) || message.content.split(`${prefix}v `);
            volume = Number(volume[1])
            if (volume > 100 || volume < 1)
                return message.reply({
                    embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} Invalid Value ! please specify between [0,100]**`),]
                }).then(msg => setTimeout(() => msg.delete(), 5000));
            client.distube.setVolume(voiceChannel, volume);
            return message.reply({ embeds: [new MessageEmbed().setColor('PURPLE').setDescription(`**${client.emotes.get('greenDot')}🗣 Volume has been set to \`${volume}\`**`)] }).then(msg => setTimeout(() => msg.delete(), 60000));
        } catch (e) {
            console.log(e);
        };
    },
};