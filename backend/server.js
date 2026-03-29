const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// ✅ DB Connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // 🔥 ADD THIS
    waitForConnections: true,
    connectionLimit: 10
});

db.getConnection((err, connection) => {
    if (err) {
        console.log("DB Connection Failed ❌", err);
    } else {
        console.log("Database Connected ✅");
        connection.release();
    }
});

// ✅ TEST ROUTE
app.get('/', (req, res) => {
    res.res.json({
    status: "ok",
    message: "Rentora API running 🚀"
});

// 🚗 GET ALL CARS
app.get('/cars', (req, res) => {
    db.query("SELECT * FROM Car", (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

// 📝 RENT CAR
app.post('/rent', (req, res) => {
    const { customer_id, car_id, rental_date, return_date, total } = req.body;

    db.query(
        "INSERT INTO Rental (Customer_ID, Car_ID, Rental_Date, Return_Date, Total_Amount) VALUES (?, ?, ?, ?, ?)",
        [customer_id, car_id, rental_date, return_date, total],
        (err, result) => {
            if (err) return res.send(err);

            // ✅ RETURN JSON
            res.json({
                message: "Car rented successfully ✅",
                rental_id: result.insertId
            });
        }
    );
});

// 💳 PAYMENT
app.post('/payment', (req, res) => {
    const { rental_id, amount, method } = req.body;

    db.query(
        "INSERT INTO Payment (Rental_ID, Payment_Date, Payment_Method, Amount) VALUES (?, NOW(), ?, ?)",
        [rental_id, method, amount],
        (err, result) => {
            if (err) return res.send(err);
            res.res.json({
                        success: true,
                        message: "Payment successful"
});
        }
    );
});

// 📄 GET RENTAL HISTORY
app.get('/rentals', (req, res) => {
    console.log("👉 /rentals route hit");
    db.query(`
        SELECT 
            Rental.Rental_ID,
            Car.Model_Brand,
            Rental.Rental_Date,
            Rental.Return_Date,
            Rental.Total_Amount
        FROM Rental
        INNER JOIN Car 
        ON Rental.Car_ID = Car.Car_ID
    `, (err, result) => {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        res.json(result);
    });
});


// 🔐 SIGNUP
app.post('/signup', async (req, res) => {
    const { name, email, phone, address, license, password } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);

        db.query(
            `INSERT INTO Customer 
            (Name, Email, Phone, Address, Driving_Licence_No, password) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, phone, address, license, hashed],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.send(err.message);
                }
                res.send("Signup successful ✅");
            }
        );
    } catch (err) {
        res.send(err.message);
    }
});

// 🔐 LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM Customer WHERE Email = ?",
        [email],
        async (err, result) => {

            if (err) {
                return res.json({ success: false, message: "Server error" });
            }

            if (result.length === 0) {
                return res.json({ success: false, message: "User not found" });
            }

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (match) {
                res.json({
                    success: true,
                    message: "Login successful ✅",
                    user: user
                });
            } else {
                res.json({ success: false, message: "Invalid password" });
            }
        }
    );
});


// 🚀 SERVER START
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});