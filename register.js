const registerForm =
    document.getElementById("registerForm");


registerForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name")
            .value
            .trim();


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
                    "http://localhost:3000/api/register",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            name: name,

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


            message.innerText =
                "Registration successful!";


            registerForm.reset();

        }


        catch (error) {

            console.log(error);

            message.innerText =
                "Unable to connect to server.";

        }

    }
);