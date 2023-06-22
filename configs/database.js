const mysql = require('mysql2/promise');
require('dotenv').config();

async function query(sql, params) {
    var env = process.env
    const connect = await mysql.createConnection({
        // host:"accountingdev.cd2norchyjvi.ap-southeast-1.rds.amazonaws.com",
        // user:"psvgitdev",
        // password:"psvgitdev2022",
        // database:"accounting"

        host:"localhost",
        user: 'root',
        password: '',
        database: 'accounting2022',
        port: '3306'
    });

    const results = await connect.execute(sql, params);
    connect.end();
    return results;
}

module.exports = { query }