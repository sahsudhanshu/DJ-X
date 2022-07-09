const { Perms } = require('../validation/permission');
const { Collection } = require('discord.js');

module.exports = async (client, PG, ascii) => {
    const table = new ascii('Message Command Loaded');

    (await PG(`${process.cwd()}/msgCommands/*/*.js`)).map(async file => {
        const command = require(file);
        if (!command.name)
            return table.addRow(file.split('/')[8], ' Failed', 'Missing a name!');

        if (command.permission) {
            if (Perms.includes(command.permission))
                command.defaultPermission = false;
            else return table.addRow(command.name, "❌ Failed", 'Permission is invalid !');
        }

        
        client.coolDowns.set(command.name, new Collection());
        
        
        client.msgCommands.set(command.name, command);
        
        await table.addRow(command.name, '💚 SUCCESSFUL !');
    });

    console.log(table.toString());

}
