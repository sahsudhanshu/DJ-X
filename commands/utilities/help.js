const { MessageEmbed, CommandInteraction } = require('discord.js');
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const prefix = process.env.D_PREFIX;

module.exports = {
    name: 'help',
    description: 'Helps you !',
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const groups = [];
        var field = [];
        (await PG(`${process.cwd()}/Commands/*`)).map(async file => {
            groups.push(file.split('/').pop());
        });

        for (let index = 0; index < groups.length; index++) {
            const element = groups[index];
            var text = ``;
            (await PG(`${process.cwd()}/Commands/${element}/*.js`)).map(async file => {
                const command = require(file);
                text += `\`${command.name}\`- ${command.description}\n`
            });
            field.push({ name: `**➡  ${groups[index].toUpperCase()}**`, value: `>>> ${text}` });
        };
        interaction.reply('Made by Sudhanshu#3823 and owned by FourierTech company');
        interaction.channel.send({
            embeds: [new MessageEmbed().setColor('BLUE').setTitle('FT HELP').setDescription(`My prefix for commands : \`${prefix}<command>\``).addFields(field).setTimestamp()]
        });
    },
};