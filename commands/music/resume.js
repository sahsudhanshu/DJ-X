const { CommandInteraction, MessageEmbed, Client, WebhookClient } = require('discord.js');

module.exports = {
    name: 'resume',
    description: 'resume the player',
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client, error) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | You must be in a voice channel To use command !`)], ephemeral: true
            });

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redDot')} | I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)], ephemeral: true
            });

        const queue = client.distube.getQueue(voiceChannel);

        if (!queue) {
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('ORANGE').setDescription(`**${client.emotes.get('redDot')} | I am not playing any thing !**`)], ephemeral: true
            });
        };
        try {
            await queue.resume(voiceChannel)
            await interaction.reply({
                embeds: [new MessageEmbed().setColor('NAVY').setDescription(`**${client.emotes.get('greenDot')} | Resumed !**`)]
            }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 5000));

        } catch (e) {
            await error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] });
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | You Have already resumed or queue is not resumed !**`),], ephemeral: true
            });
        };
    },
};