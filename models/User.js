const mysql = require('mysql');

// Connection Pool
let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

class User {
    constructor(id, first_name, last_name, email, phone, comments) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.comments = comments;
    }

    save(callback){
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', 
        [this.first_name, this.last_name, this.email, this.phone, this.comments],
        (err, rows) => {
            if (!err) {
                console.log('Added user: \n', rows);
                callback(rows);
            }
            console.log(err);
        });
    }

    update(callback){
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', 
        [this.first_name, this.last_name, this.email, this.phone, this.comments, this.id],
        (err, rows) => {
            if (!err) {
                console.log('Updated user: \n', rows);
                callback(rows);
            }
            console.log(err);
        });
    }

    static deactivate(id, callback){
        connection.query('UPDATE user SET status = ? WHERE id = ?', ['removed', id],
        (err, rows) => {
            if (!err) {
                console.log('Deactivated user: \n', rows);
                callback(rows);
            }
            console.log(err);
        });
    }

    static fetchAllActive(callback){
        connection.query('SELECT * FROM user WHERE status = "active"',
            (err, rows) => {
                if (!err) {
                    console.log('All active users: \n', rows);
                    callback(rows);
                }
                console.log(err);
            });
    }

    static searchByName(searchTerm, callback){
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%' + searchTerm + '%', '%' + searchTerm + '%'],
            (err, rows) => {
                if (!err) {
                    console.log('Search results: \n', rows);
                    callback(rows);
                }
                console.log(err);
            });
    }

    static findById(id, callback){
        connection.query('SELECT * FROM user WHERE id = ?', [id],
        (err, rows) => {
            if (!err) {
                console.log('User with id: \n', rows);
                callback(rows);
            }
            console.log(err);
        });
    }
}

module.exports = User;