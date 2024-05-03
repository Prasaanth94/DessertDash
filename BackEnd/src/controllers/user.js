const connectDB = require("../db/db");

const getUserRole = async (req, res) => {
  const loggedInId = req.body.id;

  try {
    const pool = await connectDB();

    const getUserRoleQuery = `SELECT r.role_name FROM users u JOIN roles r ON u.role_id =r.id WHERE user_id=$1`;
    const { rows } = await pool.query(getUserRoleQuery, [loggedInId]);
    const userRole = rows[0]?.role_name;

    if (!userRole) {
      return res
        .status(404)
        .json({ status: "error", msg: "User role not found" });
    }

    res.status(200).json({ message: "Successfully got role", role: userRole });
  } catch (error) {
    console.error("Error finding role :", error);
    res.status(500).json({ staus: "error", msg: "Inernal server error" });
  }
};

module.exports = getUserRole;
