const movies = [
    {
        title: "Interstellar",
        genre: "Sci-Fi",
        rating: 4.8
    },
    {
        title: "Inception",
        genre: "Sci-Fi",
        rating: 4.7
    }
];

const movieList = document.getElementById("movieList");

movies.forEach(movie => {

    movieList.innerHTML += `
        <div>
            <h2>${movie.title}</h2>
            <p>Genre: ${movie.genre}</p>
            <p>Rating: ⭐ ${movie.rating}</p>
        </div>
    `;

});