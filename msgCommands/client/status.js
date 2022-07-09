const { Message, MessageEmbed, Client } = require("discord.js");
const { connection } = require('mongoose');
require('../../events/client/ready');

module.exports = {
    name: 'status',
    description: 'Display the Status of bot',
    permission: 'ADMINISTRATOR',
    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        const response = new MessageEmbed()
            .setColor('AQUA')
            .setDescription(`**Client**: \`🟢 ONLINE\` - \`${client.ws.ping}ms\`\n **Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n**Database**: \`${switchTo(connection.readyState)}\``);
        message.reply({
            embeds: [response]
        }).then(msg => setTimeout(() => msg.delete(), 10000));
    },
};

function switchTo(val) {
    var status = ' ';
    switch (val) {
        case 0:
            status = `🔴 DISCONNECTED`;
            break;
        case 1:
            status = `🟢 CONNECTED`;
            break;
        case 2:
            status = `🟠 CONNECTING`;
            break;
        case 3:
            status = `🟣 DISCONNECTING`;
            break;
    };
    return status;
};