function signup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const license = document.getElementById("license").value;
    const password = document.getElementById("password").value;

    fetch("https://rentora-backend-c2dy.onrender.com/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            phone,
            address,
            license,
            password
        })
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        window.location.href = "login.html";
    });
}
