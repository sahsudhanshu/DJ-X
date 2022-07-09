const { CommandInteraction, MessageEmbed, WebhookClient } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Clears the message as you want',
    permission: 'MANAGE_MESSAGES',
    options: [{
        name: 'amount',
        description: 'No. of messages you want to delete',
        type: "NUMBER",
        required: true,
        minValue: '1',
        maxValue: '100',
    }, {
        name: 'target',
        description: 'Select a member (optional)',
        type: 'USER',
        required: false
    }],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        const { channel, options } = interaction;
        const amount = options.getNumber('amount');
        const target = options.getMember('target');

        const messages = await channel.messages.fetch();
        const response = new MessageEmbed()
            .setColor('LUMINOUS_VIVID_PINK');

        const logger = new WebhookClient({
            url: 'https://discord.com/api/webhooks/973173554185113600/yWyxw6c1hcAhoH2Wjnd2JSKfDM43QcpicO6V7GGhXNw5AKapVYncwx53rps5v9MhKmfe'
        });

        if (target) {
            let i = 0;
            const filtered = [];
            (await messages).filter((m) => {
                if (m.author.id === target.id && amount > 1) {
                    filtered.push(m);
                    i++;
                };
            });

            await channel.bulkDelete(filtered, true).then(messages => {
                response.setDescription(`🧹 Cleared ${messages.size} from ${interaction.channel} in ${interaction.guild.id} || ${interaction.guild.name}.`);
                interaction.reply({
                    embeds: [response]
                });
                setTimeout(() => interaction.deleteReply(), 5000);
                if (messages.size != 0) {
                    logger.send({
                        embeds: [response]
                    });
                    logger.send(`\`${messages.map(a => a)}\``);
                }
            });
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                response.setDescription(`🧹 Cleared ${messages.size} from ${interaction.channel} in ${interaction.guild.id} || ${interaction.guild}.`);
                interaction.reply({
                    embeds: [response]
                })
                setTimeout(() => interaction.deleteReply(), 2000)
                
            });
        };

    },
};