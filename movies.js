const movies = [
        {
        id: 1,
        title: "Interstellar",
        genre: "Sci-Fi",
        year: 2014,
        rating: 4.8,
        poster: "images/interstellar.jpg",
        description:
            "A group of astronauts travel through a wormhole in search of a new home for humanity."
    },

    {
        id: 2,
        title: "Inception",
        genre: "Sci-Fi",
        year: 2010,
        rating: 4.7,
        poster: "images/inception.jpg",
        description:
            "A skilled thief enters people's dreams to steal valuable information."
    },

    {
        id: 3,
        title: "3 Idiots",
        genre: "Comedy",
        year: 2009,
        rating: 4.6,
        poster: "images/3idiots.jpg",
        description:
            "Three friends experience college life, friendship and the pressure of expectations."
    },
        
    {
        id: 4,
        title: "Titanic",
        genre: "Romance",
        year: 1997,
        rating: 4.5,
        poster: "images/titanic.jpg",
        description:
            "A love story unfolds aboard the famous Titanic."
    },

    {
        id: 5,
        title: "Avengers: Endgame",
        genre: "Action",
        year: 2019,
        rating: 4.7,
        poster: "images/endgame.jpg",
        description:
            "The Avengers attempt to reverse the devastating events caused by Thanos."
    },

    {
        id: 6,
        title: "The Dark Knight",
        genre: "Action",
        year: 2008,
        rating: 4.9,
        poster: "images/dark_knight.jpg",
        description:
            "Batman faces a dangerous criminal mastermind known as the Joker."
    }
];

const movieContainer =
    document.getElementById("movieContainer");


function displayMovies(movieArray) {

    movieContainer.innerHTML = "";


    if (movieArray.length === 0) {

        movieContainer.innerHTML = `
            <div class="col-12 text-center">
                <h4>No movies found.</h4>
            </div>
        `;

        return;
    }


    movieArray.forEach(movie => {

        movieContainer.innerHTML += `

            <div class="col-sm-6 col-lg-4">

                <div class="card h-100 shadow-sm">

                    <div class="movie-poster">
                        <img
                            src="${movie.poster}"
                            alt="${movie.title}">
                    </div>

                    <div class="card-body">

                        <h5 class="card-title fw-bold">
                            ${movie.title}
                        </h5>

                        <p class="text-muted">
                            ${movie.genre} • ${movie.year}
                        </p>

                        <span class="badge bg-warning text-dark">
                            ⭐ ${movie.rating}
                        </span>

                        <p class="card-text mt-3">
                            ${movie.description}
                        </p>

                        <button
                            class="btn btn-dark w-100"
                            onclick="viewMovie(${movie.id})">

                            View Details

                        </button>

                    </div>

                </div>

            </div>

        `;
    });
}


function filterMovies() {

    const searchText =
        document.getElementById("searchInput")
        .value
        .toLowerCase();


    const selectedGenre =
        document.getElementById("genreFilter")
        .value;


    const filteredMovies =
        movies.filter(movie => {

            const matchesSearch =
                movie.title
                .toLowerCase()
                .includes(searchText);


            const matchesGenre =
                selectedGenre === "all" ||
                movie.genre === selectedGenre;


            return matchesSearch && matchesGenre;
        });


    displayMovies(filteredMovies);
}


function viewMovie(id) {

    const selectedMovie =
        movies.find(movie => movie.id === id);

    localStorage.setItem(
        "selectedMovie",
        JSON.stringify(id)
    );

    localStorage.setItem(
        "selectedMoviePoster",
        selectedMovie.poster
    );

    window.location.href = "movie.html";
}

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        filterMovies
    );


document
    .getElementById("genreFilter")
    .addEventListener(
        "change",
        filterMovies
    );


displayMovies(movies);

function logoutUser() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}