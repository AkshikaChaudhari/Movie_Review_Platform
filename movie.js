let movie = null;


/* =========================
   GET SELECTED MOVIE
========================= */

const selectedId =
    JSON.parse(
        localStorage.getItem("selectedMovie")
    );


async function loadMovie() {

    try {

        const response =
            await fetch(
                `http://localhost:3000/api/movies/${selectedId}`
            );


        if (!response.ok) {

            throw new Error(
                "Movie not found"
            );

        }


        movie =
            await response.json();


        displayMovie();


        displayReviews();

    }

    catch (error) {

        console.log(error);

        document.getElementById(
            "movieDetails"
        ).innerHTML = `

            <div class="alert alert-danger">
                Unable to load movie details.
            </div>

        `;

    }

}


/* =========================
   DISPLAY MOVIE
========================= */

function displayMovie() {

    const movieDetails =
        document.getElementById(
            "movieDetails"
        );


    movieDetails.innerHTML = `

        <div class="row align-items-center">

            <div class="col-md-4">

                <div class="movie-detail-poster">
                    🎬
                </div>

            </div>


            <div class="col-md-8">

                <h1 class="fw-bold">
                    ${movie.title}
                </h1>

                <p class="text-muted">
                    ${movie.genre} • ${movie.year}
                </p>

                <h4>
                    ⭐ ${movie.rating} / 5
                </h4>

                <p class="mt-4">
                    ${movie.description}
                </p>

                <button
                    class="btn btn-danger"
                    onclick="addToWatchlist()">

                    ❤️ Add to Watchlist

                </button>

            </div>

        </div>

    `;

}


/* =========================
   WATCHLIST
========================= */

async function addToWatchlist() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("Please login first!");
        return;
    }

    try {

        const response = await fetch("http://localhost:3000/api/watchlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: currentUser.id,
                movieId: movie.id
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert("Movie added to watchlist!");

    } catch (error) {
        console.error(error);
        alert("Failed to add movie to watchlist.");
    }
}

/* =========================
   REVIEWS
========================= */

async function displayReviews() {

    const reviewsContainer =
        document.getElementById("reviews");


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/reviews/${movie.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch reviews"
            );

        }


        const reviews =
            await response.json();


        reviewsContainer.innerHTML = "";


        if (reviews.length === 0) {

            reviewsContainer.innerHTML = `

                <p class="text-muted">
                    No reviews yet.
                    Be the first to review this movie!
                </p>

            `;

            return;

        }


        reviews.forEach(review => {

            reviewsContainer.innerHTML += `

                <div class="card mb-3">

                    <div class="card-body">

                        <h6 class="fw-bold">
                            ${review.user_name}
                        </h6>

                        <p>
                            ${"⭐".repeat(review.rating)}
                        </p>

                        <p>
                            ${review.review_text}
                        </p>

                    </div>

                </div>

            `;

        });

    }


    catch (error) {

        console.log(error);

        reviewsContainer.innerHTML = `

            <p class="text-danger">
                Unable to load reviews.
            </p>

        `;

    }

}

/* =========================
   SUBMIT REVIEW
========================= */

const reviewForm =
    document.getElementById("reviewForm");


reviewForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const currentUser =
            JSON.parse(
                localStorage.getItem("currentUser")
            );


        if (!currentUser) {

            alert(
                "Please login before writing a review."
            );

            window.location.href =
                "login.html";

            return;

        }


        const rating =
            Number(
                document.getElementById("rating").value
            );


        const reviewText =
            document.getElementById("reviewText")
            .value
            .trim();


        if (reviewText === "") {

            alert(
                "Please write a review."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/reviews",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            userId:
                                currentUser.id,

                            movieId:
                                movie.id,

                            rating:
                                rating,

                            reviewText:
                                reviewText

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(data.error);

                return;

            }


            alert(
                "Review added successfully!"
            );


            reviewForm.reset();


            displayReviews();

        }


        catch (error) {

            console.log(error);

            alert(
                "Unable to connect to server."
            );

        }

    }
);

/* START */

loadMovie();

function logoutUser() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}