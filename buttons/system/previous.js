const { Client, ButtonInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    id: 'previous',

    /**
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client, error) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redStar')} | You must be in a voice channel To use command !`)], ephemeral: true
            });

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redStar')} | I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)], ephemeral: true
            });

        const queue = client.distube.getQueue(voiceChannel);

        if (!queue) {
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('ORANGE').setDescription(`**${client.emotes.get('redStar')} | I am not playing any thing !**`)], ephemeral: true
            });
        };
        try {
            const song = await queue.previous()
            await interaction.reply({
                embeds: [new MessageEmbed().setColor('NAVY').setDescription(`**${client.emotes.get('blueStar')} Playing previous song ${song.name}**`)]
            }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 5000));
            await interaction.message.delete();

        } catch (e) {
            await error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] });
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redStar')} There is no previous song available !**`),], ephemeral: true
            });
        };
    }
}
