const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );


if (!currentUser) {

    alert("Please login first.");

    window.location.href = "login.html";

}


/* USER INFORMATION */

document.getElementById("userName").innerText =
    currentUser.name;

document.getElementById("userEmail").innerText =
    currentUser.email;


/* GET REVIEWS FROM MYSQL */

async function displayMyReviews() {

    const container =
        document.getElementById("myReviews");

    try {

        const response = await fetch(
            `http://localhost:3000/api/user-reviews/${currentUser.id}`
        );

        const myReviews = await response.json();

        if (!response.ok) {

            throw new Error(
                myReviews.error || "Failed to load reviews"
            );

        }


        /* REVIEW COUNT */

        document.getElementById("reviewCount")
            .innerText = myReviews.length;


        /* CLEAR OLD CONTENT */

        container.innerHTML = "";


        /* NO REVIEWS */

        if (myReviews.length === 0) {

            container.innerHTML = `
                <div class="alert alert-info">
                    You haven't written any reviews yet.
                </div>
            `;

            return;
        }


        /* DISPLAY REVIEWS */

        myReviews.forEach(review => {

            container.innerHTML += `

                <div class="card shadow-sm mb-3">

                    <div class="card-body">

                        <h5>
                            ${review.movie_title}
                        </h5>

                        <p>
                            ${"⭐".repeat(review.rating)}
                        </p>

                        <p>
                            ${review.review_text}
                        </p>

                        <button
                            class="btn btn-sm btn-danger"
                            onclick="deleteReview(${review.id})">

                            Delete Review

                        </button>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="alert alert-danger">
                Failed to load reviews.
            </div>
        `;

    }

}


/* DELETE REVIEW */
async function deleteReview(reviewId) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this review?"
        );

    if (!confirmation) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/api/reviews/${reviewId}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.error);
            return;
        }

        alert("Review deleted successfully!");

        displayMyReviews();

    } catch (error) {

        console.error(error);

        alert("Failed to delete review.");

    }
}

/* LOGOUT */

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "login.html";

}


displayMyReviews();