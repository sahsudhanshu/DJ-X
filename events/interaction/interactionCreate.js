const { Client, MessageEmbed, CommandInteraction, WebhookClient } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('⛔ An error is occured !')
                ]
            }) && client.commands.delete(interaction.commandName) && console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction and got an error : ${interaction.commandName}`);

            const logger = new WebhookClient({ url: 'https://discord.com/api/webhooks/973176322597744700/jpGOa7IYt0OCw-VablbAerGyb8hnrbc-P9ufekxtWhKUYVo3Ilu_hniDhh3ZULmGxbzt' })
            const error = new WebhookClient({ url: 'https://discord.com/api/webhooks/975795668205584394/-ZsTYIH4aePuDIkV7yLONm6mWcR_oZuk6MNASoqsHGyUeafHGhupAKG7qJc3DydX6ZQw' })

            logger.send({ embeds: [new MessageEmbed().setColor('ORANGE').setDescription(`\`${interaction.user.tag}\` | \`${interaction.user.id}\` in \`${interaction.channel.name}\` | \`${interaction.channel.id}\` triggered an interaction : \`${interaction.commandName}\` in server \`${interaction.guild}\` | \`${interaction.guildId}\``)] });
            command.execute(interaction, client, error);
        
        }
    }
}