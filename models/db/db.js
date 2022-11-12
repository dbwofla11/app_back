const mysql = require('mysql');
const dbconfig = require('../../config/dbconfig');
require("dotenv").config();

const db = mysql.createConnection(dbconfig);

module.exports = db;