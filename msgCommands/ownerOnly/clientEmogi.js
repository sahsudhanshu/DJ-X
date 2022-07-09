const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name : 'emogi',
    description : 'emogi',
    owner : true,

    /**
     *  
     * @param {Message} message 
     * @param {Client} client 
     */
    
    async execute(message, client) {
        var ary = [];
        client.emotes.map(emote => {
            ary.push({name : `${emote.name}`, value : `${emote} - ${emote.id}`})
        });

        message.channel.send({embeds : [new MessageEmbed().setColor('BLURPLE').setDescription('emogi').addFields(ary)]});
    }
}
