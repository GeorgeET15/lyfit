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
