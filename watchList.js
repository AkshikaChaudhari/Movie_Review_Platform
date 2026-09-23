const currentUser = JSON.parse(localStorage.getItem("currentUser"));
console.log("Current User:", currentUser);

const container = document.getElementById("movieList");

async function loadWatchlist() {

    if (!currentUser) {
        container.innerHTML = `
            <p class="text-center">
                Please login to view your watchlist.
            </p>
        `;
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/watchlist/${currentUser.id}`
        );

        const movies = await response.json();

        if (movies.length === 0) {
            container.innerHTML = `
                <p class="text-center">
                    Your watchlist is empty.
                </p>
            `;
            return;
        }

        container.innerHTML = "";

        movies.forEach(movie => {

            const card = document.createElement("div");

            card.className = "col-md-6 col-lg-4 watchlist-item";

            card.draggable = true;

            card.style.cursor = "grab";

            card.addEventListener("dragstart", function(event) {

                event.dataTransfer.setData(
                    "text/plain",
                    card.innerHTML
                );

                card.style.opacity = "0.5";

            });


            card.addEventListener("dragend", function() {

                card.style.opacity = "1";

            });


            card.addEventListener("dragover", function(event) {

                event.preventDefault();

            });


            card.addEventListener("drop", function(event) {

                event.preventDefault();

                const draggedContent =
                    event.dataTransfer.getData("text/plain");

                const draggedCard =
                    Array.from(container.children).find(
                        item => item.innerHTML === draggedContent
                    );

                if (draggedCard && draggedCard !== card) {

                    container.insertBefore(
                        draggedCard,
                        card
                    );

                }

            });
                
                card.innerHTML = `
                <div class="card h-100 shadow-sm border-0">

                    <div class="card-body">

                        <h4 class="card-title fw-bold">
                            🎬 ${movie.title}
                        </h4>

                        <p class="text-muted mb-2">
                            ${movie.genre} • ${movie.year} • ${movie.language}
                        </p>

                        <p class="mb-3">
                            <span class="fs-5">⭐</span>
                            <strong>${movie.rating}</strong>
                        </p>

                        <div class="d-flex gap-2">

                            <button
                                class="btn btn-success"
                                onclick="markWatched(this)">
                                Mark as Watched
                            </button>

                            <button
                                class="btn btn-danger"
                                onclick="removeMovie(this, ${movie.movie_id})">
                                Remove
                            </button>

                        </div>

                    </div>

                </div>
            `;

            
            container.appendChild(card);
        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p class="text-danger text-center">
                Failed to load watchlist.
            </p>
        `;
    }
}


function markWatched(button) {

    button.innerText = "Watched ✓";
    button.disabled = true;

}

async function removeMovie(button, movieId) {

    if (!currentUser) {
        alert("Please login first!");
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/watchlist/${currentUser.id}/${movieId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        button.closest(".watchlist-item").remove();

        if (container.children.length === 0) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        🎬 Your watchlist is empty.
                    </div>
                </div>
            `;
        }

        alert("Movie removed from watchlist!");

    } catch (error) {

        console.error(error);
        alert("Failed to remove movie.");

    }
}

loadWatchlist();

function logoutUser() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}