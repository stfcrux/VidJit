

//bringing in sequelize
const Sequelize = require('sequelize');

// importing the db.js file which contains the db name,username password etc
const db = require('./db');


//instantiates sequelize with database parameters
const sequelize = new Sequelize(db.database,db.username,db.password,{

    host: db.host,
    dialect: 'mysql', // tell sequelize that we are using mysql (this ORM supports sqllite and others too)
    operatorsAliases: false,

    define:{ 
        timestamps:false  // telling the db to not insert time stamp fields (its auto) 
    },

    pool:{ //Database system params
        max: 5, // max number of connections at one time
        min: 0,
        acquire:30000,
        idle: 10000
    },

});

// to allow use in other places
module.exports = sequelize;