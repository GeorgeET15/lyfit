const PORT = process.env.PORT || 8000;
const express = require("express");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const nodemailer = require("nodemailer");
const cron = require("node-cron"); // For scheduling tasks
const moment = require("moment"); // For date handling

const uri = process.env.URI;
const app = express();
const cors = require("cors");

// Middleware to handle CORS
const corsOptions = {
  origin: "*", // Allow requests from any origin. Change this for production.
  credentials: true, // Access-Control-Allow-Credentials: true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB client setup with a persistent connection
const client = new MongoClient(uri);
let db;

async function connectToDB() {
  try {
    await client.connect();
    db = client.db("app-data");
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

// Route for home
app.get("/", (req, res) => {
  res.json("LyFit Backend");
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  const generatedUserId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const users = db.collection("users");
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).send("User already exists. Please login");
    }

    const sanitizedEmail = email.toLowerCase();
    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };

    const insertedUser = await users.insertOne(data);

    const token = jwt.sign(
      { userId: generatedUserId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d", // Consider using a shorter expiry time or refresh tokens for better security
      }
    );

    res.status(201).json({ token, userId: generatedUserId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = db.collection("users");
    const user = await users.findOne({ email });

    if (user) {
      const correctPassword = await bcrypt.compare(
        password,
        user.hashed_password
      );

      if (correctPassword) {
        const token = jwt.sign(
          { userId: user.user_id },
          process.env.JWT_SECRET,
          {
            expiresIn: "1d", // Same suggestion for refresh tokens as above
          }
        );

        return res
          .status(200) // Use 200 for successful login
          .json({ success: true, token, userId: user.user_id });
      }
    }

    res.status(400).json({ success: false, error: "Invalid Credentials" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "An error occurred during login." });
  }
});

//Onboarding Route

app.post("/onboarding", async (req, res) => {
  const { username, age, weight, height, diet_res, exe_style, userId } =
    req.body;

  try {
    const user_data = {
      username,
      age,
      weight,
      height,
      diet_res,
      exe_style,
      userId,
    };

    const user = db.collection("onboarding_data");
    const result = await user.insertOne(user_data);

    res.status(201).json({
      success: true,
      message: "Onboarding completed successfully!",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, error: "Error completing onboarding" });
  }
});

// diet planning

app.get("/getuserdata", async (req, res) => {
  const { userId } = req.body;
  const on_data = db.collection("onboarding_data");

  on_data
    .findOne()
    .then((onb_data) => res.json(onb_data))
    .catch((err) => res.json(err));
});

// Server Start
app.listen(PORT, async () => {
  // Ensure the database connection is successful before starting the server
  if (!process.env.URI) {
    console.error("MongoDB URI is not defined");
    process.exit(1);
  }
  await connectToDB();
  console.log(`Server running on PORT ${PORT}`);
});
