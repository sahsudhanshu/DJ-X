const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: 'leave',
    description: 'leave the voice channel',
    
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client, error) {
        const { member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redStar')} | You must be in a voice channel To use command !**`)], ephemeral: true
            });

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redStar')} | I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)], ephemeral: true
            });

        try {

            await client.distube.voices.leave(voiceChannel);
            await interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('blueStar')} | DISCONNECTED**`)]
            }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 5000));

        } catch (e) {

            await error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] });
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`${client.emotes.get('redStar')} | I have not joined any channel`),], ephemeral: true
            });
            
        };
    },
};