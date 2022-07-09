const { ButtonInteraction, Client, MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        const button = client.buttons.get(interaction.customId);

        if (button.permissions && !interaction.member.permissions.has(button.permission))
            return interaction.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${client.emotes.get('redDot0')} You are Missing permissions`)] });

        if (button.ownerOnly && interaction.member.id !== interaction.guild.ownerId)
            return interaction.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${client.emotes.get('redDot0')} You are not the owner`)] });
            const error = new WebhookClient({ url: 'https://discord.com/api/webhooks/975795668205584394/-ZsTYIH4aePuDIkV7yLONm6mWcR_oZuk6MNASoqsHGyUeafHGhupAKG7qJc3DydX6ZQw' })
        button.execute(interaction, client,error);
        
    },
};