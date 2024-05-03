const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  const pool = new Pool({
    user: "db_user",
    password: process.env.DB_PASSWORD,
    database: "dessert_dash",
    port: 5432,
  });

  try {
    await pool.connect();
    console.log("Connected to PostgreSQL database");
    return pool;
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error);
    throw error; // Throw error to be caught by caller
  }
};

module.exports = connectDB;
