const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'skp2005',
    database: process.env.DB_NAME || 'itprephub'
});

db.connect((err) => {
    if(err){
        console.log('Database Error:', err);
        return;
    }
    console.log('MySQL Connected!');
});

module.exports = db;