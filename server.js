// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs"); // For password hashing

const app = express();
app.use(bodyParser.json());

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(bodyParser.json());  // Parse incoming JSON data

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/SmartHome", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  phone: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/signup", async (req, res) => {
  const { name, phone, password } = req.body;
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, phone, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log("Received login request:", { phone, password });

    const user = await User.findOne({ phone, password });
    console.log("Query result:", user);

    if (!user) {
      console.log("No user found with provided credentials");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
