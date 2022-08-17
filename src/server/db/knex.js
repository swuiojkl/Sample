require("dotenv").config();

module.exports = {
    development: {
        client: "mysql",
        connection: {
            host: process.env.MYSQL_DB_HOST,
            user: process.env.MYSQL_DB_USER,
            database: process.env.MYSQL_DB,
            password: process.env.MYSQL_DB_PASSWORD,
            port: Number(process.env.MYSQL_DB_PORT)
        }
    },

    production: {
        client: "mysql",
        connection: {
            database: process.env.MYSQL_DB,
            user: process.env.MYSQL_DB_USER,
            password: process.env.MYSQL_DB_PASSWORD,
        },
        pool: {
            min: 2,
            max: 10,
        }
    },
};