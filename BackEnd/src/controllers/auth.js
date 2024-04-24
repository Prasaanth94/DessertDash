const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const connectDB = require("../db/db");
const userModel = require("../models/User");

const seedUsers = async (req, res) => {
  try {
    const pool = await connectDB();

    const users = [
      {
        email: "test1@example.com",
        HASH: "password",
        username: "user1",
        role: "user",
      },
      {
        email: "business1@example.com",
        HASH: "password",
        username: "buisness1",
        role: "businessOwner",
      },
      {
        email: "admin1@example.com",
        HASH: "password",
        username: "admin1",
        role: "admin",
      },
    ];

    for (const user of users) {
      const { email, HASH, username, role } = user;
      const hashedPassword = await bcrypt.hash(HASH, 12);
      await pool.query(
        "INSERT INTO users(email, HASH, username, role) VALUES($1,$2,$3,$4)",
        [email, hashedPassword, username, role]
      );
    }

    res.status(200).json({ status: "Success", msg: "Seeding completed" });
  } catch (error) {
    console.error("Catch error: ", error);
  }
};

const registerUser = async (req, res) => {
  const { email, HASH, username, role } = req.body;

  if (!email || !HASH || !username || !role) {
    return res
      .status(400)
      .json({ status: "error", msg: "Please fill in all fields" });
  }

  const hashedPassword = await bcrypt.hash(HASH, 12);

  try {
    const pool = await connectDB();

    const checkEmailQuery = `SELECT COUNT(*) FROM users WHERE email = $1`;
    const { rows: emailRows } = await pool.query(checkEmailQuery, [email]);
    const existingEmailCount = parseInt(emailRows[0].count);

    if (existingEmailCount) {
      return res
        .status(400)
        .json({ status: "error", msg: "Email already in use." });
    }

    const checkUsernameQuery = `SELECT COUNT(*) FROM users WHERE email = $1`;
    const { rows: usernameRows } = await pool.query(checkUsernameQuery, [
      username,
    ]);
    const existingUsernameCount = parseInt(usernameRows[0].count);

    if (existingUsernameCount) {
      return res
        .status(400)
        .json({ status: "error", msg: "Username already exists." });
    }

    const insertUserQuery = `
        INSERT INTO users (email, HASH, username, role)
        VALUES($1, $2, $3, $4)`;

    await pool.query(insertUserQuery, [email, hashedPassword, username, role]);

    res.status(200).json({ message: "User registered succesfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { email, HASH } = req.body;

  if (!email || !HASH) {
    return res
      .status(400)
      .json({ status: "error", msg: "Please fill on all fields now" });
  }

  try {
    const pool = await connectDB();

    const getUserQuery = `SELECT * FROM users WHERE email = $1`;
    const { rows } = await pool.query(getUserQuery, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ status: "error", msg: "Invalid email" });
    }

    const hashedPasswordFromDB = rows[0].hash;

    //compare automatically extracts the salt and cost factor from the hasedpasswordfromDB
    const passwordMatch = await bcrypt.compare(HASH, hashedPasswordFromDB);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ status: "error", msg: "passwords not matching" });
    }

    const claims = {
      email: email,
      role: rows[0].role,
      loggedInId: rows[0].id,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    console.log(access);

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30D",
      jwtid: uuidv4(),
    });
    res.json({ access, refresh });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Internal Server Error" });
  }
};

const refresh = (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);
    const claims = {
      email: decoded.email,
      role: decoded.role,
    };

    console.log("decoded : ", decoded);

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Refreshing token failed" });
  }
};

module.exports = { registerUser, login, refresh, seedUsers };
