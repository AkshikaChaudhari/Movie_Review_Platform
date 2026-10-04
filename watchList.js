const currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

const container =
    document.getElementById("watchlistContainer");


const moviePosters = {
    "Interstellar": "images/interstellar.jpg",
    "Inception": "images/inception.jpg",
    "3 Idiots": "images/3idiots.jpg",
    "Titanic": "images/titanic.jpg",
    "Avengers: Endgame": "images/endgame.jpg",
    "The Dark Knight": "images/dark_knight.jpg"
};


async function loadWatchlist() {

    if (!currentUser) {

        container.innerHTML = `
            <div class="w-100 text-center my-4">

                <p class="text-muted fs-5">
                    Please login to view your watchlist.
                </p>

                <a
                    href="login.html"
                    class="btn btn-dark mt-2">
                    Go to Login
                </a>

            </div>
        `;

        return;
    }


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/watchlist/${currentUser.id}`
            );


        if (!response.ok) {
            throw new Error("Failed to load watchlist");
        }


        const movies =
            await response.json();


        if (movies.length === 0) {

            container.innerHTML = `
                <div class="alert text-center border p-5 shadow-sm rounded-4 w-100">

                    <span class="fs-1 d-block mb-3">
                        🍿
                    </span>

                    <h4 class="fw-bold mb-2">
                        Your watchlist is empty
                    </h4>

                    <p class="text-muted mb-4">
                        You haven't added any movies to your watchlist yet.
                    </p>

                    <a
                        href="movies.html"
                        class="btn btn-primary px-4 py-2">

                        Discover Movies

                    </a>

                </div>
            `;

            return;
        }


        container.innerHTML = "";


        movies.forEach(movie => {

            const card =
                document.createElement("div");

            card.className =
                "watchlist-item";

            card.draggable = true;


            const poster =
                moviePosters[movie.title] ||
                "images/interstellar.jpg";


            card.innerHTML = `

                <div class="watchlist-card">

                    <div class="watchlist-poster">

                        <img
                            src="${poster}"
                            alt="${movie.title}"
                        >

                    </div>


                    <div class="watchlist-content">

                        <h4>
                            ${movie.title}
                        </h4>


                        <p>
                            ${movie.genre}
                            •
                            ${movie.year}
                            •
                            ${movie.language}
                        </p>


                        <div class="watchlist-rating">

                            ⭐ ${movie.rating}

                        </div>


                        <button
                            class="btn btn-primary w-100"
                            onclick="markWatched(this)">

                            Mark as Watched

                        </button>


                        <button
                            class="btn btn-danger w-100 mt-2"
                            onclick="removeMovie(this, ${movie.movie_id})">

                            Remove

                        </button>

                    </div>

                </div>

            `;


            /* =========================
               DRAG AND DROP
               ========================= */

            card.addEventListener(
                "dragstart",
                function() {

                    card.style.opacity = "0.5";

                    window.draggedCard = card;

                }
            );


            card.addEventListener(
                "dragend",
                function() {

                    card.style.opacity = "1";

                    window.draggedCard = null;

                }
            );


            card.addEventListener(
                "dragover",
                function(event) {

                    event.preventDefault();

                }
            );


            card.addEventListener(
                "drop",
                function(event) {

                    event.preventDefault();

                    const draggedCard =
                        window.draggedCard;


                    if (
                        draggedCard &&
                        draggedCard !== card
                    ) {

                        container.insertBefore(
                            draggedCard,
                            card
                        );

                    }

                }
            );


            container.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="alert alert-danger text-center w-100">

                Failed to connect to movie server.

                <br>

                Please make sure the server
                is running on port 3000.

            </div>

        `;

    }

}


/* =========================
   MARK AS WATCHED
   ========================= */

function markWatched(button) {

    button.innerText =
        "Watched ✓";

    button.className =
        "btn btn-success w-100";

    button.disabled = true;

}


/* =========================
   REMOVE FROM WATCHLIST
   ========================= */

async function removeMovie(
    button,
    movieId
) {

    if (!currentUser) {

        alert("Please login first!");

        return;

    }


    if (
        !confirm(
            "Remove this movie from your watchlist?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:3000/api/watchlist/${currentUser.id}/${movieId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Failed to remove movie."
            );

            return;

        }


        const item =
            button.closest(
                ".watchlist-item"
            );


        item.style.transition =
            "all 0.3s ease";

        item.style.transform =
            "scale(0.8)";

        item.style.opacity =
            "0";


        setTimeout(
            function() {

                item.remove();


                if (
                    container.children.length === 0
                ) {

                    loadWatchlist();

                }

            },
            300
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Failed to remove movie from watchlist."
        );

    }

}


/* =========================
   LOGOUT
   ========================= */

function logoutUser() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";

}


/* =========================
   INITIALIZE
   ========================= */

loadWatchlist();