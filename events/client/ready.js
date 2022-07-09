const { Client } = require('discord.js');
const mongoose = require('mongoose');
const database = process.env.DATABASE;
const { Emotes } = require('../../main/config/emotes');

module.exports = {
    name: 'ready',
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        console.log('Ready!');
        client.user.setActivity('Music', { type: 'STREAMING' });
        client.user.setStatus('online');

        if (!database) return;

        mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('Database connected !') }).catch(err => console.log(err));


        await Emotes.map(obj => {
            const name = obj.name;
            const id = obj.value;
            const emogi = client.emojis.cache.get(id);
            client.emotes.set(name, emogi);
        })
        console.log('Emogis Added!');
    },
};