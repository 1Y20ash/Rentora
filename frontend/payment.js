
const rental_id = localStorage.getItem("rental_id");
const amount = localStorage.getItem("amount");
document.getElementById("amount").innerText = "Amount: ₹" + amount;

function makePayment() {

    const method = document.getElementById("method").value;

    fetch("http://localhost:3000/payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            rental_id: rental_id,
            amount: amount,
            method: method
        })
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        window.location.href = "success.html";
    });
}