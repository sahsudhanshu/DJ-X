const { Perms } = require('../validation/permission');
const { Client } = require('discord.js');

/**
 * @param {Client} client
 */

module.exports = async (client, PG, ascii, guildId) => {
    const table = new ascii('Slash Command Loaded');

    commandsArray = [];

    await (await PG(`${process.cwd()}/commands/*/*.js`)).map(async file => {
        const command = require(file);
        if (!command.name) 
        return table.addRow(file.split('/')[8], "❌ Failed", 'Missing a name !');

        if (!command.context && !command.description)
            return table.addRow(command.name, "❌ Failed", 'Missing a discription !');

        if (command.permission) {
            if (Perms.includes(command.permission))
                command.defaultPermission = false;
            else return table.addRow(command.name, "❌ Failed", 'Permission is invalid !');
        }

        client.commands.set(command.name, command);
        commandsArray.push(command);
        
        await table.addRow(command.name, '📗 SUCCESSFUL !');
    });

    console.log(table.toString());

    client.on('ready', async () => {
        const guild = client.guilds.cache.get(guildId);

        await guild.commands.set(commandsArray);
        // await client.application.commands.set(commandsArray);
    });

};