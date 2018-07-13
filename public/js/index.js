document.addEventListener("submit", function (event) {
    event.preventDefault();

    let form;
    let url;

    if (event.target.className === "signup-form") {
        form = document.getElementsByClassName("signup-form");
        url = "/api/signup";
    } else {
        form = document.getElementsByClassName("login-form");
        url = "/api/login";
    }

    const formData = new FormData(form[0]);
    const userData = {};

    for (let pair of formData.entries()) {
        userData[pair[0]] = pair[1];
    }

    fetch(url, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            "Content-Type": "application/json"
        }
    })
        // .then(response => response.json())
        .then(data => window.location.href = data.url) 
        .catch(error => console.error(error.message));
});