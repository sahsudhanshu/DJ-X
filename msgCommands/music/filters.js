const { MessageEmbed, Client, Message } = require('discord.js');


module.exports = {
    name: 'filter',
    aliases: ['fl'],
    description: 'filters for the player',
    /**
     * @param {Client} client 
     * @param {Message} message 
     * @returns 
     */
    async execute(message, client, prefix) {
        const { member, guild, content } = message;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return message.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} You must be in a voice channel To use command !**`)],
            }).then(msg => setTimeout(() => msg.delete(), 5000));

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return message.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redDot')} | I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)],
            }).then(msg => setTimeout(() => msg.delete(), 5000));

        const queue = client.distube.getQueue(voiceChannel);

        if (!queue) return message.reply({
            embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | There is nothing in the queue right now!**`)]
        }).then(msg => setTimeout(() => msg.delete(), 5000));


        let filter = null;
        let text = content.toLowerCase().split(`${prefix}filter `)[1] || content.toLowerCase().split(`${prefix}fl `)[1];

        const filters = ['tremolo', 'earwax', 'phaser', 'mcompand', 'surround', 'reverse', 'haas', 'gate', 'flanger', 'vaporwave', 'nightcore', 'karaoke', 'echo', 'bassboost', '3d', 'off']

        if (!filters.includes(text.toLowerCase()) || !text ) return message.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | You Have not entered any filter or entered incorrect filter !**`)] }).then(msg => setTimeout(() => msg.delete(), 5000));

        if (text.toLowerCase() == 'off') {
            filter = false;
        } else {
            filter = text.toLowerCase();
        };

        const setfilter = queue.setFilter(filter);
        return message.reply({
            embeds: [new MessageEmbed().setColor('FUCHSIA').setDescription(`**${client.emotes.get('greenDot')} | 🏁 Applied ! \n\nCurrent Queue Filter: \`${setfilter.join(', ') || 'Off'}\`**`)]
        }).then(msg => setTimeout(() => msg.delete(), 30000));
    },
};