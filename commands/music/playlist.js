const { CommandInteraction, Client, MessageEmbed, Message } = require("discord.js");
const playlistModel = require('../../main/schemas/playlistDB');

module.exports = {
    name: "playlist",
    aliases: ['plplay'],
    description: "Global Playlist",
    options: [{
        name: 'play',
        description: 'play your playlist',
        type: 'SUB_COMMAND',
        options: [{
            name: 'name',
            description: 'Enter your Playlist Name',
            type: 'STRING',
            required: true
        }]
    }, {
        name: "create",
        description: "create a new playlist",
        type: "SUB_COMMAND",
        options: [{
            name: 'name',
            description: 'Provide a name of playlist tip use 3 digit number',
            type: 'STRING',
            required: true
        }, {
            name: 'link',
            description: 'Provide the link of playlist',
            type: 'STRING',
            required: true
        }]
    }, {
        name: "saved",
        description: "Give your saved playlists",
        type: "SUB_COMMAND",
    },
    {
        name: "delete",
        description: "delete your saved playlist",
        type: "SUB_COMMAND",
    },
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        const { options, user, channel, member } = interaction;
        const voiceChannel = member.voice.channel;
        const redDot = client.emojis.cache.get('971058180010414140');
        const greenDot = client.emojis.cache.get('971071712940662835');
        const userPlaylist = await playlistModel.find({ userId: user.id }).exec();

        try {
            switch (options.getSubcommand()) {
                case 'play': {
                        const playlist = await playlistModel.find({ name: options.getString('name'), userId: user.id })
                        if (playlist.length > 0) {
                            client.distube.play(voiceChannel, playlist[0].playlist[0], {
                                textChannel: channel,
                                member: member
                            });
                            return interaction.reply({embeds : [new MessageEmbed().setColor('YELLOW').setDescription(`${greenDot} ✉ Request Recieved !`)]}).then(setTimeout(() => {
                                interaction.deleteReply();
                            }, 500));
                        } else {
                            return interaction.reply({embeds : [new MessageEmbed().setColor('RED').setDescription(`${redDot} Not Found`)]});
                        }
                    
                };
                case 'saved': {
                    if (userPlaylist.length == 0) {
                        return interaction.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${redDot}  **||  You dont have any playlist create a new playlist by command**`).addField('Playlist Create', '\`/playlist create\`')], }).then(setTimeout(() => interaction.deleteReply(), 5000));
                    } else {
                        var field = [];
                        for (let index = 0; index < userPlaylist.length; index++) {
                            var text = ``;
                            const element = userPlaylist[index];
                            for (let j = 0; j < element.playlist.length; j++) {
                                const playlistSong = element.playlist[j];
                                text += `\`${j + 1}\`- ${playlistSong}\n`;
                            };
                            field.push({ name: `**➡ ${element.name}**`, value: `>>> ${text}` });
                        };
                        return interaction.reply({ embeds: [new MessageEmbed().setColor('GOLD').setDescription('Your Global Saved Playlist').setTitle(`Playlist`).addFields(field)], }).then(setTimeout(() => interaction.deleteReply(), 50000));
                    };
                };

                case 'create': {
                    if (userPlaylist.length >= 5) return interaction.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${redDot}** You have exceded the amount of playlist please use**`).addField('Delete Command', '\`/playlist delete\`')] }).then(setTimeout(() => interaction.deleteReply(), 5000))
                    const name = await playlistModel.find({ name: options.getString('name'), userId: user.id });

                    if (name.length > 0) return interaction.reply({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${redDot} **Please enter a unique name,\nYou have already ${options.getString('name')} in your playlist**`)] }).then(setTimeout(() => interaction.deleteReply(), 5000));

                    const playlist = new playlistModel({
                        name: options.getString('name'),
                        userId: user.id,
                        userTag: user.tag,
                        playlist: [options.getString('link')]
                    });
                    playlist.save();
                    return interaction.reply({ embeds: [new MessageEmbed().setColor('GREEN').setDescription(`${greenDot} **Succesfully Saved the playlist\nNow you can use this playlist globaly**`)] }).then(setTimeout(() => interaction.deleteReply(), 5000));
                };
                case 'delete': {
                    var field = [];
                    const filter = (m) => {
                        if (m.author.id == user.id) return false
                        if (m.content == '1') return true
                        if (m.content == '2') return true
                        if (m.content == '3') return true
                        if (m.content == '4') return true
                        if (m.content == '5') return true
                        channel.send('You have enter wrong input please try again later')
                        return false
                    }
                    for (let index = 0; index < userPlaylist.length; index++) {
                        var text = ``;
                        const element = userPlaylist[index];
                        for (let j = 0; j < element.playlist.length; j++) {
                            const playlistSong = element.playlist[j];
                            text += `\`${j + 1}\`- ${playlistSong}\n`;
                        };
                        field.push({ name: `**➡ ${element.name}**`, value: `>>> ${text}` });
                    };

                    await interaction.reply({ embeds: [new MessageEmbed().setColor('GOLD').setDescription('Your Global Saved Playlist').setTitle(`Playlist`).addFields(field)], })

                    channel.send({ embeds: [new MessageEmbed().setColor('DARKER_GREY').setDescription('Type from 1-5 to delete a playlist')] })

                    const response = channel.awaitMessages({ filter, max: 1, time: 60_000, errors: ['time'] })

                };
            }
            return;
        } catch (error) {
            console.log(error)
        }
    }
};