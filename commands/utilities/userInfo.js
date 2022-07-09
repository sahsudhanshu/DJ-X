const { ContextMenuInteraction, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'userinfo',
    type: 'USER',
    permission: 'ADMINISTRATOR',
    context: true,
    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     */
    async execute(interaction) {
        const target = await interaction.guild.members.fetch(interaction.targetId);
        const { user, roles, joinedTimestamp } = target;
        const response = new MessageEmbed()
            .setColor('AQUA')
            .setAuthor({
                name: user.id,
                iconURL: user.displayAvatarURL({
                    dynamic: true,
                    size: 512
                })
            })
            .setThumbnail(user.displayAvatarURL({
                dynamic: true,
                size: 512
            }))
            .addField('ID', `${user.id}`, true)
            .addField('Member Since', `<t:${parseInt(joinedTimestamp / 1000)}:>`)
            .addField('Roles', `${roles.cache.map(r => r).join(' ').replace('@everyone', '') || 'NONE'}`)
            .addField('Discord User since', `<t:${parseInt(user.createdTimestamp / 1000)}:>`, true)

        interaction.reply({
            embeds: [response,],
            ephemeral: true
        });
    }
}