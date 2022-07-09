const client = require('../../main/index');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: 'ready',
    async execute() {
        const status = queue => `Volume : \`${queue.volume}%\` | Filter : \`${queue.filters.join(', ') || 'Off'}\` | Loop : \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}\` | Autoplay : \`${queue.autoplay ? 'On' : 'Off'}\``;

        client.distube
            .on('playSong', async (queue, song) => {

                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('previous')
                        .setStyle('SECONDARY')
                        .setEmoji(`◀️`),
                    new MessageButton()
                        .setCustomId('pause&resume')
                        .setEmoji(`⏯️`)
                        .setStyle('SECONDARY'),
                    new MessageButton()
                        .setCustomId('skip')
                        .setStyle('SECONDARY')
                        .setEmoji(`▶️`),
                    new MessageButton()
                        .setCustomId('add')
                        .setStyle('SUCCESS')
                        .setEmoji('🔍'),
                    new MessageButton()
                        .setCustomId('leave')
                        .setStyle('SECONDARY')
                        .setEmoji(`🛑`)
                );
                    
                msg = await queue.textChannel.send({
                    embeds: [new MessageEmbed().setColor('DARK_VIVID_PINK')
                        .setTitle(`${client.emotes.get('purpleDiamond')} Playing `)
                        .setDescription(`${client.emotes.get('arrow')} **[${song.name}](${song.url})**`)
                        .addField('Views', `${song.views}`, true)
                        .addField(`${client.emotes.get('like')}`, `${song.likes}`, true)
                        .addField(`${client.emotes.get('yellowArrow')}Download`, `**[click here](${song.streamURL})**`, true)
                        .addField('Requested By', `${song.user}`, true)
                        .addField('Duration', `\`${song.formattedDuration}\``, true)
                        .addField('Source', `${song.source}`.toUpperCase(), true)
                        .addField('Filters', `\`${queue.filters.join(', ') || 'OFF'}\``)
                        .setThumbnail(song.thumbnail)
                    ], components: [row]
                }).then(msg => setTimeout(() => { if (queue.textChannel.messages.cache.get(msg.id)) return msg.delete() }, song.duration * 1000));
            })
            .on('addSong', async (queue, song) => {
                msg = await queue.textChannel.send({
                    embeds: [new MessageEmbed().setColor('GREEN').setDescription(`**${client.emotes.get('greenDot')} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}**`)], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId('skip').setLabel('NEXT').setStyle('SUCCESS').setEmoji(`${client.emotes.get('greenDot')}`))]
                }).then(msg => setTimeout(() => { if (queue.textChannel.messages.cache.get(msg.id)) return msg.delete() }, song.duration * 1000));
            })
            .on('addList', async (queue, playlist) =>
                await queue.textChannel.send({
                    embeds: [new MessageEmbed().setColor('GOLD').setDescription(`**${client.emotes.get('greenDot')} | Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}**`)]
                })
            )
            .on('error', (channel, e) => {
                channel.send(`**${client.emotes.get('redDot')} | An error encountered: ${e.toString().slice(0, 1974)}**`)
                console.error(e)
            })
            .on('empty', queue => queue.textChannel.send({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} |  Voice channel is empty! Leaving the channel...**`)]
            }).then(msg => setTimeout(() => msg.delete(), 10000)))
            .on('searchNoResult', (message, query) =>
                message.channel.send({
                    embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} | No result found for \`${query}\`!**`)]
                })
            )
            .on('finish', async queue => await queue.textChannel.send({
                embeds: [new MessageEmbed().setColor('RANDOM').setDescription(`**${client.emotes.get('greenDot')} | Finished!**`)]
            }).then(msg => setTimeout(() => msg.delete(), 10000)));
    },
};