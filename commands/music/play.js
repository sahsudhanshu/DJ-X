const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: 'play',
    description: 'Plays a song',
    options: [{
        name: 'query',
        description: 'Provide a name or url of song',
        type: 'STRING',
        required: true
    }],
    /**
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client, error) {
        const { options, member, guild, channel } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redStar')} | You must be in a voice channel To use command !**`),], ephemeral: true
            });

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redStar')} | I am already playing music in <#${guild.me.voice.channelId}>**`),], ephemeral: true
            });
        try {
            client.distube.play(voiceChannel, options.getString('query'), { textChannel: channel, member: member });

            return interaction.reply({
                embeds: [new MessageEmbed().setColor('BLUE').setDescription(`**${client.emotes.get('blueStar')} | ✉ Request Recieved !**`),]
            }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 500));

        } catch (error) {
            await error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })
        };
    },
};