const mysql = require('mysql2');
const dotenv = require('dotenv').config

const pool = mysql.createPool({
    host: "54.39.129.84",
    user: "celebrep_caiquecarvalho",
    password: "585103Aa@",
    database: "celebrep_baseteste_acaicopacabana"
});

module.exports = pool