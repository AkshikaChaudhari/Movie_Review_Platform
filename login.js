const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const email =
            document.getElementById("email")
            .value
            .trim();


        const password =
            document.getElementById("password")
            .value;


        const message =
            document.getElementById("message");


        try {

            const response =
                await fetch(
                    "http://localhost:3000/api/login",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            email: email,

                            password: password

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                message.innerText =
                    data.error;

                return;

            }


            // Save logged-in user

            localStorage.setItem(
                "currentUser",
                JSON.stringify(data.user)
            );


            message.innerText =
                "Login successful!";


            setTimeout(function() {

                window.location.href =
                    "movies.html";

            }, 800);

        }


        catch (error) {

            console.log(error);

            message.innerText =
                "Unable to connect to server.";

        }

    }
);