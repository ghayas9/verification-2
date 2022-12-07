// config.js
require('dotenv').config();
module.exports = {
    //Database config
    username: process.env.username,
    password: process.env.password,
    database: process.env.database,

    //Email config
    CLIENT_ID :process.env.CLIENT_ID,
    CLEINT_SECRET :process.env.CLEINT_SECRET,
    REDIRECT_URI : process.env.REDIRECT_URI,
    REFRESH_TOKEN :process.env.REFRESH_TOKEN,

    //host Detail
    hostUrl : process.env.hostUrl,

    //contact email
    email:process.env.email
};

