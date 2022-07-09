const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: 'filter',
    description: 'filters for the player',
    options: [{
        name: 'options',
        description: 'choose a filter or turn off it',
        type: 'STRING',
        choices: [{ name: 'OFF', value: 'OFF' }, { name: '3d', value: '3d', }, { name: 'bassboost', value: 'bassboost', }, { name: 'echo', value: 'echo', }, { name: 'karaoke', value: 'karaoke', }, { name: 'nightcore', value: 'nightcore' }, { name: 'vaporwave', value: 'vaporwave' }, { name: 'flanger', value: 'flanger' }, { name: 'gate', value: 'gate' }, { name: 'haas', value: 'haas' }, { name: 'reverse', value: 'reverse' }, { name: 'surround', value: 'surround' }, { name: 'mcompand', value: 'mcompand' }, { name: 'phaser', value: 'phaser' }, { name: 'earwax', value: 'earwax' }, { name: 'tremolo', value: 'tremolo' },], required: true
    },],

    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @returns 
     */

    async execute(interaction, client, error) {
        const { options, member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | You must be in a voice channel To use command !**`)],
                ephemeral: true
            });

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redDot')} | I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)], ephemeral: true
            });

        const queue = client.distube.getQueue(voiceChannel);

        if (!queue) return interaction.reply({
            embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | There is nothing in the queue right now!**`)],
            ephemeral: true
        });

        try {
            let filter = null;
            if (options.getString('options') == 'OFF') {
                filter = false;
            } else {
                filter = options.getString('options');
            };

            const setfilter = queue.setFilter(filter);
            await interaction.reply({
                embeds: [new MessageEmbed().setColor('FUCHSIA').setDescription(`**${client.emotes.get('greenDot')} | 🏁 Applied ! \n\nCurrent Queue Filter: \`${setfilter.join(', ') || 'Off'}\`**`)]
            }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 30000));
            
        } catch (error) {
            await error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(error)] });
        };
    },
};