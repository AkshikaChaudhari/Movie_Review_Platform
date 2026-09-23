const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

require("dotenv").config();

const app = express();

const PORT = 3000;


/* =========================
   MYSQL CONNECTION
========================= */

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect(function(error) {

    if (error) {

        console.log("MySQL connection failed.");
        console.log(error.message);

        return;
    }

    console.log("MySQL connected successfully!");

});


/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
    }

    next();
});

/* =========================
   TEST ROUTE
========================= */

app.get("/", function(req, res) {

    res.send("Movie Review Platform API is running!");

});


/* =========================
   GET ALL MOVIES
========================= */

app.get("/api/movies", function(req, res) {

    const query =
        "SELECT * FROM movies";


    connection.query(
        query,
        function(error, results) {

            if (error) {

                console.log(error);

                res.status(500).json({
                    error: "Failed to fetch movies"
                });

                return;
            }


            res.json(results);
        }
    );
});

app.get("/api/movies/:id", function(req, res) {

    const movieId = req.params.id;

    const query =
        "SELECT * FROM movies WHERE id = ?";

    connection.query(
        query,
        [movieId],
        function(error, results) {

            if (error) {

                res.status(500).json({
                    error: "Failed to fetch movie"
                });

                return;
            }

            if (results.length === 0) {

                res.status(404).json({
                    error: "Movie not found"
                });

                return;
            }

            res.json(results[0]);

        }
    );

});

// REGISTER USER
app.post("/api/register", async function(req, res) {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users
            (name, email, password)
            VALUES (?, ?, ?)
        `;

        connection.query(
            query,
            [name, email, hashedPassword],
            function(error, result) {

                if (error) {

                    if (error.code === "ER_DUP_ENTRY") {
                        res.status(400).json({
                            error: "Email already registered"
                        });
                        return;
                    }

                    res.status(500).json({
                        error: "Registration failed"
                    });
                    return;
                }

                res.json({
                    message: "Registration successful",
                    userId: result.insertId
                });

            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Registration failed"
        });

    }

});

// LOGIN USER
// LOGIN USER

app.post("/api/login", async function(req, res) {

    const email = req.body.email;
    const password = req.body.password;

    const query = `
        SELECT id, name, email, password
        FROM users
        WHERE email = ?
    `;

    connection.query(
        query,
        [email],
        async function(error, results) {

            if (error) {
                res.status(500).json({
                    error: "Login failed"
                });
                return;
            }

            if (results.length === 0) {
                res.status(401).json({
                    error: "Invalid email or password"
                });
                return;
            }

            const user = results[0];

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {
                res.status(401).json({
                    error: "Invalid email or password"
                });
                return;
            }

            res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

        }
    );
});


// GET REVIEWS FOR A MOVIE

app.get("/api/reviews/:movieId", function(req, res) {

    const movieId = req.params.movieId;

    const query = `
        SELECT
            reviews.id,
            reviews.movie_id,
            reviews.user_id,
            reviews.rating,
            reviews.review_text,
            reviews.review_date,
            users.name AS user_name
        FROM reviews
        JOIN users
            ON reviews.user_id = users.id
        WHERE reviews.movie_id = ?
        ORDER BY reviews.review_date DESC
    `;

    connection.query(
        query,
        [movieId],
        function(error, results) {

            if (error) {

                res.status(500).json({
                    error: "Failed to fetch reviews"
                });

                return;
            }

            res.json(results);

        }
    );

});


// ADD REVIEW

app.post("/api/reviews", function(req, res) {

    const userId = req.body.userId;
    const movieId = req.body.movieId;
    const rating = req.body.rating;
    const reviewText = req.body.reviewText;


    const query = `
        INSERT INTO reviews
        (user_id, movie_id, rating, review_text)
        VALUES (?, ?, ?, ?)
    `;


    connection.query(
        query,
        [
            userId,
            movieId,
            rating,
            reviewText
        ],
        function(error, result) {

            if (error) {

                res.status(500).json({
                    error: "Failed to add review"
                });

                return;
            }


            res.json({

                message: "Review added successfully",

                reviewId: result.insertId

            });

        }
    );

});

// ADD MOVIE TO WATCHLIST
app.post("/api/watchlist", function(req, res) {
    const userId = req.body.userId;
    const movieId = req.body.movieId;

    const query = `
        INSERT INTO watchlist
        (user_id, movie_id)
        VALUES (?, ?)
    `;

    connection.query(
        query,
        [userId, movieId],
        function(error, result) {
            if (error) {
                if (error.code === "ER_DUP_ENTRY") {
                    res.status(400).json({
                        error: "Movie already in watchlist"
                    });
                    return;
                }

                res.status(500).json({
                    error: "Failed to add movie to watchlist"
                });
                return;
            }

            res.json({
                message: "Movie added to watchlist",
                watchlistId: result.insertId
            });
        }
    );
});


// GET USER WATCHLIST
app.get("/api/watchlist/:userId", function(req, res) {
    const userId = req.params.userId;

    const query = `
        SELECT
            watchlist.id,
            movies.id AS movie_id,
            movies.title,
            movies.genre,
            movies.year,
            movies.language,
            movies.rating
        FROM watchlist
        JOIN movies
            ON watchlist.movie_id = movies.id
        WHERE watchlist.user_id = ?
    `;

    connection.query(
        query,
        [userId],
        function(error, results) {
            if (error) {
                res.status(500).json({
                    error: "Failed to fetch watchlist"
                });
                return;
            }

            res.json(results);
        }
    );
});

// REMOVE MOVIE FROM WATCHLIST
app.delete("/api/watchlist/:userId/:movieId", function(req, res) {

    const userId = req.params.userId;
    const movieId = req.params.movieId;

    const query = `
        DELETE FROM watchlist
        WHERE user_id = ? AND movie_id = ?
    `;

    connection.query(
        query,
        [userId, movieId],
        function(error, result) {

            if (error) {
                res.status(500).json({
                    error: "Failed to remove movie from watchlist"
                });
                return;
            }

            res.json({
                message: "Movie removed from watchlist"
            });
        }
    );
});


// GET REVIEWS WRITTEN BY A USER
app.get("/api/user-reviews/:userId", function(req, res) {

    const userId = req.params.userId;

    const query = `
        SELECT
            reviews.id,
            reviews.movie_id,
            reviews.rating,
            reviews.review_text,
            reviews.review_date,
            movies.title AS movie_title
        FROM reviews
        JOIN movies
            ON reviews.movie_id = movies.id
        WHERE reviews.user_id = ?
        ORDER BY reviews.review_date DESC
    `;

    connection.query(
        query,
        [userId],
        function(error, results) {

            if (error) {
                res.status(500).json({
                    error: "Failed to fetch user reviews"
                });
                return;
            }

            res.json(results);
        }
    );
});

// DELETE REVIEW
app.delete("/api/reviews/:reviewId", function(req, res) {

    const reviewId = req.params.reviewId;

    const query = `
        DELETE FROM reviews
        WHERE id = ?
    `;

    connection.query(
        query,
        [reviewId],
        function(error, result) {

            if (error) {
                res.status(500).json({
                    error: "Failed to delete review"
                });
                return;
            }

            res.json({
                message: "Review deleted successfully"
            });
        }
    );
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, function() {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});