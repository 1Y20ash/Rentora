fetch("https://rentora-backend-c2dy.onrender.com/rentals")
.then(res => res.json())
.then(data => {
    console.log("DATA:", data);
    const container = document.getElementById("history");
    
    if (data.length === 0) {
        container.innerHTML = "<h3>No rentals yet ❌</h3>";
        return;
    }

    data.forEach(rent => {

        const div = document.createElement("div");

        div.innerHTML = `
            <h3>${rent.Model_Brand}</h3>
            <p>${rent.Rental_Date} → ${rent.Return_Date}</p>
            <p>Total: ₹${rent.Total_Amount}</p>
            <hr>
        `;

        container.appendChild(div);
    });

});
function logout() {
    localStorage.removeItem("user");
    alert("Logged out 👋");
    window.location.href = "login.html";
}