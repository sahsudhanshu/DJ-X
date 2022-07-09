const { Message, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Skips the song',
    aliases: ['s'],
    /**
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
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redDot')} | I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)],
            }).then(msg => setTimeout(() => msg.delete(), 5000));

        const queue = client.distube.getQueue(voiceChannel);

        if (!queue) {
            return message.reply({
                embeds: [new MessageEmbed().setColor('ORANGE').setDescription(`**${client.emotes.get('redDot')} | I am not playing any thing !**`)]
            }).then(msg => setTimeout(() => msg.delete(), 5000));
        };

        try {
            const song = await queue.skip(voiceChannel);
            await message.reply({
                embeds: [new MessageEmbed().setColor('NAVY').setDescription(`**${client.emotes.get('greenDot')} | Skipped! Now playing:\n${song.name}**`)]
            }).then(msg => setTimeout(() => msg.delete(), 5000));

            if (queue.paused) { 
                await queue.resume(voiceChannel);
                return message.channel.send({
                    embeds: [new MessageEmbed().setColor('NAVY').setDescription(`**${client.emotes.get('blueStar')} | Resumed !**`)]
                }).then(setTimeout(() => message.delete().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 5000));
            }
        } catch (e) {
            client.distube.stop(voiceChannel);
            return message.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('greenDot')} | Skipped ! But Nothing to play next **`)]
            }).then(msg => setTimeout(() => msg.delete(), 5000));
        };
    },
};