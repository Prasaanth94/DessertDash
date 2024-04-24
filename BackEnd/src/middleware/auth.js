const jwt = require("jsonwebtoken");
const connectDB = require("../db/db");

const authBusinessOwner = async (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }

  const token = req.headers["authorization"].replace("Bearer", "").trim();

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.user = { id: decoded.loggedInId };

      const pool = await connectDB();
      const getUserQuery = `SELECT * FROM users WHERE id = $1`;
      const { rows } = await pool.query(getUserQuery, [decoded.loggedInId]);

      if (rows.length === 0) {
        throw new Error("User not found");
      }

      const userRole = rows[0].role;

      if (userRole === "businessOwner") {
        req.decoded = decoded;
        next();
      } else {
        throw new Error("User is not a business owner");
      }
    } catch (error) {
      console.error("Authetication error : ", error.message);
      return res.status(401).json({ status: "error", msg: "Unauthorized" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "missing token" });
  }
};

module.exports = { authBusinessOwner };
