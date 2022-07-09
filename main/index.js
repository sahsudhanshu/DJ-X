// ! Require the necessary classes
const { Client, Collection } = require('discord.js');

// * Create a new client instance
const client = new Client({ intents: 32767 });
const discordModals= require('discord-modals');
discordModals(client);

// * Require other necessary classes 
require('dotenv').config();
const guildId = process.env.GUILDID;
const { promisify } = require('util');
const { glob } = require('glob');
const PG = promisify(glob);
const ascii = require('ascii-table');

// * Creating collections for commands and emogi
client.commands = new Collection();
client.emotes = new Collection();
client.msgCommands = new Collection();
client.coolDowns = new Collection();
client.buttons = new Collection();

// ! for music system
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

// ! Creationg Distube for Singing
client.distube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({ emitEventsAfterFetching: true }),
        new SoundCloudPlugin(),
        new YtDlpPlugin()
    ],
    youtubeDL: false
});

// ? Exporting Client
module.exports = client;

// * Command and Event handlig is done here
['events', 'slashCommands', 'messageCommands','buttons'].forEach(handler => {
    require(`./handlers/${handler}`)(client, PG, ascii, guildId)
});

//! for login
client.login(process.env.BOT_TOKEN);