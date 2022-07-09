const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const { connection } = require('mongoose');
require('../../events/client/ready');

module.exports = {
    name: 'status',
    description: 'Display the status',
    permission: 'ADMINISTRATOR',
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     * @returns 
     */
    async execute(interaction, client) {
        const response = new MessageEmbed()
            .setColor('AQUA')
            .setDescription(`**Client**: \`🟢 ONLINE\` - \`${client.ws.ping}ms\`\n **Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n**Database**: \`${switchTo(connection.readyState)}\``);
        return interaction.reply({
            embeds: [response]
        }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 60000));
    },
};

function switchTo(val) {
    var status = ' ';
    switch (val) {
        case 0:
            status = `🔴 DISCONNECTED`
            break;
        case 1:
            status = `🟢 CONNECTED`
            break;
        case 2:
            status = `🟠 CONNECTING`
            break;
        case 3:
            status = `🟣 DISCONNECTING`
            break;
    };
    return status;
};