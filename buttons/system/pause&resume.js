const { MessageEmbed, Client, ButtonInteraction } = require('discord.js');

module.exports = {
    id: 'pause&resume',
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction, client, error) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redStar')} You must be in a voice channel To use command !**`)],
                ephemeral: true
            });

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redStar')} I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)],
                ephemeral: true
            });

        const queue = client.distube.getQueue(voiceChannel);

        if (!queue) {
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('ORANGE').setDescription(`**${client.emotes.get('redStar')} I am not playing any thing !**`)], ephemeral: true
            });
        };

        try {
        
            if (queue.paused) { 
                await queue.resume(voiceChannel);
                return interaction.reply({
                    embeds: [new MessageEmbed().setColor('NAVY').setDescription(`**${client.emotes.get('blueStar')} | Resumed !**`)]
                }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 5000));
            }

            await queue.pause(voiceChannel);
            const msg = await interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redStar')} Paused! **`)]
            }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 5000));


        } catch (e) {
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`${client.emotes.get('redStar')} | You Have already pause the queue !`),], ephemeral: true
            });
        };
    },
};