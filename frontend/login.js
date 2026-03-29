function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json()) // ✅ NOW SAFE
    .then(data => {
        if (data.success) {
            alert(data.message);

            // ✅ store user
            localStorage.setItem("user", JSON.stringify(data.user));

            window.location.href = "index.html";
        } else {
            alert(data.message);
        }
    });
}