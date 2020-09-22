const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const video = require('../models/Video');


const setUpDB = (drop) => {
    mySQLDB.authenticate()
    .then(() => {
        console.log('Vidjot database connected');
    })
    .then(() => {


        user.hasMany(video);
        mySQLDB.sync({
            force:drop
        }).then(()=> {
            console.log('Create tables if none exists')
        }).catch(err => console.log(err))
    })
    .catch(err => console.log('Error:' + err));
};

module.exports = {setUpDB};