const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );


function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}