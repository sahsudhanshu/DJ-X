const { ButtonInteraction, Client } = require('discord.js');
const { Modal, TextInputComponent, showModal } = require('discord-modals');

module.exports = {
    id: 'add',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redStar')} | You must be in a voice channel To use command !**`)],
                ephemeral: true
            });

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redStar')} | I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)],
                ephemeral: true
            });


        const modal = new Modal()
            .setCustomId('addSong')
            .setTitle('Add a Song')
            .addComponents(
                new TextInputComponent()
                    .setCustomId('song')
                    .setPlaceholder('enter the link or song name')
                    .setRequired(true)
                    .setStyle('SHORT')
                    .setLabel('Add a Song')
            );
        showModal(modal, {
            client: client,
            interaction: interaction
        });
    }
}