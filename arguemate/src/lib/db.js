const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: "arguemate.c1usmou2atlc.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "ArgueMateUofTHacks",
  database: "arguemate",
  port: 3306, // Default MySQL port
});

// Export a promise-based pool
const promisePool = pool.promise();

module.exports = promisePool;
