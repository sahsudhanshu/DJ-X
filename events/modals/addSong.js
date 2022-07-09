const { Modal } = require("discord-modals");
const { MessageEmbed, Client } = require("discord.js");

module.exports = {
    name: 'modalSubmit',
    /**
     *  
     * @param {Modal} modal 
     * @param {Client} client
     */
    async execute(modal, client) {
        if (modal.customId !== 'addSong') return;

        await modal.deferReply({ emphernal: true })

        const song = modal.getTextInputValue('song');

        const { member, channel } = modal;
        const voiceChannel = member.voice.channel;

        client.distube.play(voiceChannel, song, { textChannel: channel, member: member });

        return modal.followUp({
            embeds: [new MessageEmbed().setColor('BLUE').setDescription(`**${client.emotes.get('blueStar')} | ✉ Request Recieved !**`),]
        }).then(setTimeout(() => modal.deleteReply().catch(e => error.send({ embeds: [new MessageEmbed().setColor('RED').setDescription(`${e}`)] })), 500))

    }

}