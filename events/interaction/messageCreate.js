const { MessageEmbed, Client, Message, WebhookClient } = require('discord.js');
require('dotenv').config();
const dPrefix = process.env.D_PREFIX;
const prefixModel = require('../../main/schemas/prefixDB');

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client) {
        const prefixDB = await prefixModel.find({guildID : message.guildId});
        if (prefixDB.length == 0) {
            var prefix = dPrefix.toLowerCase();
        } else {
            var prefix = prefixDB[0].prefix.toLowerCase();
        }

        if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.msgCommands.get(commandName) || client.msgCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

        if (command.owner && message.author.id !== '786511354675855362') return message.delete();

        if (!command) return
        if (command.permissions) {
            const authperms = message.channel.permissionsFor(message.author);
            if (!authperms || !authperms.has(command.permissions)) 
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('⛔ You Don\'t have permissions to use this commands')
                ]
            }).then((sent) => {
                setTimeout(() => {
                    sent.delete();
                }, 5000);
            });
        };


        const now = Date.now();
        const timestamp = client.coolDowns.get(command.name)
        const amount = (command.coolDown || 2)*1000;

        if (timestamp.has(message.author.id)) {
            const expireTime = timestamp.get(message.author.id) + amount;
            if (now < expireTime) {
                const timeleft = (expireTime - now)/1000;
                return message.reply({embeds :[new MessageEmbed().setColor('RED').setDescription(`Please wait another ${timeleft} more seconds to be able to run this command`)]}).then((sent) => {
                    setTimeout(() => {
                        sent.delete();
                    }, 5000);
                });;
            } else {timestamp.delete(message.author.id)}
        };

        timestamp.set(message.author.id, now)

        try {
            await command.execute(message, client, prefix);   
            message.delete();
        } catch (error) {
            console.log(error);
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription('⛔ An error is Please try again later  !')
                ]
            }) && console.log(`${message.member.user.tag} in #${message.channel.name} triggered andddddd interaction and got an error : ${commandName}`);
        }

        const logger = new WebhookClient({ url: 'https://discord.com/api/webhooks/973176322597744700/jpGOa7IYt0OCw-VablbAerGyb8hnrbc-P9ufekxtWhKUYVo3Ilu_hniDhh3ZULmGxbzt' })

        logger.send({ embeds: [new MessageEmbed().setColor('ORANGE').setDescription(`\`${message.member.user.tag}\` | \`${message.member.user.id}\` in \`${message.channel.name}\` | \`${message.channel.id}\` triggered an interaction : \`${commandName}\` in server \`${message.guild}\` | \`${message.guildId}\``)] });

        
        
    }
}
