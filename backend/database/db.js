const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'skp2005',
    database: 'itprephub'
});

db.connect((err) => {
    if(err){
        console.log('Database Error:', err);
        return;
    }
    console.log('MySQL Connected!');
});

module.exports = db;