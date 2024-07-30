const mysql = require("mysql2/promise");
const dotenv = require("dotenv").config();

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: "root",
  password: "585103Aa@",
  database: "celebreprojeto",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = pool;
