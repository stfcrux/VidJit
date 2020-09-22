const mySQLDB = require('./DBConfig');
const user = require('../models/User');
const video = require('../models/Video');


// if drop is true, all existing tables are droped and recreated
const setUpDB = (drop) => {
    mySQLDB.authenticate()  // log into the DB using the DBConfig object
    .then(() => {
        console.log('Vidjot database connected'); // if successful, print out that we have connected to the data base .then() acts as a promise)
    })
    .then(() => {

        //defines the relationship where a user has many videos.
        // in this case the primary key from user will be a foriegn key in video
        // thus we do not need to define our own foreign key
        
        user.hasMany(video);
        mySQLDB.sync({ // creates table if none exists
            force:drop
        }).then(()=> {
            console.log('Create tables if none exists')
        }).catch(err => console.log(err))
    })
    .catch(err => console.log('Error:' + err));
};

module.exports = {setUpDB};