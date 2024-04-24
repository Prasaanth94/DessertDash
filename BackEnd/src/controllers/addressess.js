const connectDB = require("../db/db");

const getAllAddress = async (req, res) => {
  try {
    const pool = await connectDB();

    const getAllAddressQuery = `SELECT * FROM addressess`;

    const result = await pool.query(getAllAddressQuery);
    res
      .status(200)
      .json({ message: "Retrieved all addressess", addrresses: result.rows });
  } catch (error) {
    console.error("Error getting addressess: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = getAllAddress;
