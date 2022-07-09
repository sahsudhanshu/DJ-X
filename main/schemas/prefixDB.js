const { default: mongoose } = require("mongoose");

const prefixSchemas = new mongoose.Schema({
    prefix : String, 
    guildID : String
});

const prefixModel = mongoose.model('Prefix',prefixSchemas);

module.exports = prefixModel;