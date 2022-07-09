const { CommandInteraction, MessageEmbed, Client } = require('discord.js');

module.exports = {
    name: 'volume',
    description: 'manages the volume of player',
    options: [{
        name: 'percent',
        description: 'X = X% lies between 0 - 100',
        type: 'NUMBER',
        minValue: '0',
        maxValue: '100',
        required: true
    }],
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction, client) {
        const { options, member, guild } = interaction;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} You must be in a voice channel To use command !**`)],
                ephemeral: true
            });

        if (guild.me.voice.channel && voiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('YELLOW').setDescription(`**${client.emotes.get('redDot')} I am connectted to <#${guild.me.voice.channelId}> Please Join it !**`)],
                ephemeral: true
            });

        const queue = client.distube.getQueue(voiceChannel);

        if (!queue) {
            return interaction.reply({
                embeds: [new MessageEmbed().setColor('ORANGE').setDescription(`**${client.emotes.get('redDot')} I am not playing any thing !**`)], ephemeral: true
            });
        };
        try {
            const volume = options.getNumber('percent');
            if (volume > 100 || volume < 1)
                return interaction.reply({
                    embeds: [new MessageEmbed().setColor('RED').setDescription(`**${client.emotes.get('redDot')} Invalid Value ! please specify between [0,100]**`),]
                }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 5000));
            client.distube.setVolume(voiceChannel, volume);
            await interaction.reply({ embeds: [new MessageEmbed().setColor('PURPLE').setDescription(`**${client.emotes.get('greenDot')}🗣 Volume has been set to \`${volume}\`**`)] }).then(setTimeout(() => interaction.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), queue.duration));
        } catch (e) {
            await error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] });
        };
    },
};