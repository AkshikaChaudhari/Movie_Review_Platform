const mysql = require("mysql2");

require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function(error) {

    if (error) {
        console.log("Database connection failed.");
        console.log(error.message);
        return;
    }

    console.log("MySQL connected successfully!");

    connection.query(
        "SELECT * FROM movies",
        function(error, results) {

            if (error) {
                console.log("Error fetching movies.");
                console.log(error.message);
                return;
            }

            console.log("Movies:");
            console.log(results);

            connection.end();
        }
    );
});