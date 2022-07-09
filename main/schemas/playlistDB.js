const mongoose = require('mongoose');

const playlistSchemas = new mongoose.Schema({
    name : String,
    userId : String,
    userTag : String,
    playlist : Array
});

const playlistModel = mongoose.model('playlists',playlistSchemas);
module.exports = playlistModel;