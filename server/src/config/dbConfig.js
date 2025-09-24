const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config( {
    path:path.resolve(__dirname, "../../.env")
})

const pool = mysql.createPool( {
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    host:process.env.DB_HOST,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT||3306
})

export default pool.promise();