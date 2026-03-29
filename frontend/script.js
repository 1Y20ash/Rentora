const user = JSON.parse(localStorage.getItem("user"));
const carImages = {
    "Hyundai": "https://images.unsplash.com/photo-1549924231-f129b911e442",
    "Toyota": "https://images.unsplash.com/photo-1502877338535-766e1452684a",
    "BMW": "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
};
const div = document.createElement("div");
div.classList.add("col-md-4");


const welcome = document.getElementById("welcome");
const loginLink = document.getElementById("loginLink");
const logoutBtn = document.getElementById("logoutBtn");

if (user) {
    welcome.innerText = "Hi, " + user.Name;

    loginLink.style.display = "none";
    logoutBtn.style.display = "inline-block";
} else {
    loginLink.style.display = "inline-block";
    logoutBtn.style.display = "none";
}


if (!user) {
    alert("Please login first ❌");
    window.location.href = "login.html";
}
fetch("http://localhost:3000/cars")
.then(res => res.json())
.then(data => {
    const container = document.getElementById("cars");

    container.innerHTML = ""; // clear old

    data.forEach(car => {
    const div = document.createElement("div");
div.classList.add("card");



    div.innerHTML = `
    <div class="card p-3 glass-card">
        

        <h3>${car.Model_Brand}</h3>
        <p>₹${car.Daily_Rate}/day</p>

        <label>Start Date:</label>
        <input type="date" id="start-${car.Car_ID}">

        <label>End Date:</label>
        <input type="date" id="end-${car.Car_ID}">

        <button onclick="rentCar(${car.Car_ID}, ${car.Daily_Rate})">
            Rent Now 
        </button>
    </div>
`;

    container.appendChild(div);
});
});

function logout() {
    localStorage.removeItem("user");
    alert("Logged out 👋");
    window.location.href = "login.html";
}


// 🚗 RENT FUNCTION
function rentCar(carId, rate) {

    const start = document.getElementById(`start-${carId}`).value;
    const end = document.getElementById(`end-${carId}`).value;

    if (!start || !end) {
        alert("Please select dates ❌");
        return;
    }

    const days = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);

    if (days <= 0) {
        alert("Invalid dates ❌");
        return;
    }

    const total = days * rate;

    fetch("http://localhost:3000/rent", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            customer_id: user.Customer_ID,
            car_id: carId,
            rental_date: start,
            return_date: end,
            total: total
        })
    })
    .then(res => res.json())
.then(data => {
    alert(`✅ ${data.message}\nTotal: ₹${total}`);

    // ✅ SAVE rental ID
    localStorage.setItem("rental_id", data.rental_id);
    localStorage.setItem("amount", total);

    window.location.href = "payment.html";
});
}