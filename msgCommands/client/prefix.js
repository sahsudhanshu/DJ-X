const { Message, MessageEmbed, Client } = require("discord.js");
const prefixModel = require('../../main/schemas/prefixDB');

module.exports = {
    name: 'prefix',
    aliases: ['pre'],
    description: 'set your prefix',
    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client, prefix) {

        if (message.content.includes(`${prefix}prefix set`)) {
            if (message.content == `${prefix}prefix set`) return message.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`Please Give the \`<prefix>\`\n\n\`${prefix}prefix set <your prefix>\``)] }).then(msg => setTimeout(() => msg.delete(), 5000));
            const tempprefix = message.content.split(' ').pop();
            await prefixModel.deleteMany({ guildID: message.guildId })
            const guildPrefix = new prefixModel({
                prefix: tempprefix,
                guildID: message.guildId
            });
            guildPrefix.save();
            return message.reply({ embeds: [new MessageEmbed().setColor('BLUE').setDescription(`Now \`${tempprefix}\` is your prefix !`)] }).then(msg => setTimeout(() => msg.delete(), 60000));
        };

        if (message.content.includes(`${prefix}prefix`)) {
            message.channel.send({ embeds: [new MessageEmbed().setColor('AQUA').setDescription(`Your prefix is \`${prefix}\``)] }).then(msg => setTimeout(() => msg.delete(), 60000))
            message.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`Please Give the \`<prefix>\`\n\n\`${prefix}prefix set <your prefix>\``)] }).then(msg => setTimeout(() => msg.delete(), 50000));
        };
    },
};