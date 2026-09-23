# 🎬 MovieReview - Movie Review Platform

A full-stack movie review platform where users can explore movies, write reviews, and maintain a personal watchlist.

## 🚀 Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- Bootstrap 5
- Local Storage
- Drag and Drop API

### Backend
- Node.js
- Express.js
- MySQL
- REST APIs
- bcrypt for password hashing

### Data
- MySQL database for users, movies, reviews and watchlist
- JSON used for practical/data handling

## ✨ Features

- User registration and login
- Password hashing using bcrypt
- Browse movies
- Search movies
- Filter movies by genre
- View movie details
- Add and view movie reviews
- Delete personal reviews
- Add movies to a personal watchlist
- Remove movies from watchlist
- Mark movies as watched
- Drag and drop watchlist ordering
- User profile with review history
- Responsive Bootstrap-based interface
- Logout functionality

## 📁 Project Structure

```text
Movie_Review_Platform/
│
├── index.html
├── login.html
├── register.html
├── movies.html
├── movie.html
├── watchList.html
├── profile.html
│
├── login.js
├── register.js
├── movies.js
├── movie.js
├── watchList.js
├── profile.js
├── style.css
│
├── movie.json
├── package.json
├── package-lock.json
│
└── backend/
    ├── app.js
    ├── database.js
    ├── readMovies.js
    ├── multiMovies.js
    └── Script.js