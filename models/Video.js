const Sequelize = require('sequelize');
const db = require('../config/DBconfig');


// creating a Video table in MYSQL data base with the below entries
const Video = db.define('video', {
    title: {
        type: Sequelize.STRING  
    },

    story:{
        type: Sequelize.STRING(2000)
    },

    language: {
        type: Sequelize.STRING
    },
    subtitles:{
        type: Sequelize.STRING
    },

    classification: {
        type: Sequelize.STRING
    },
    dateRelease:{
        type: Sequelize.DATE
    },



});

module.exports = Video;