const connectDB = require("../db/db");

const createShop = async (req, res) => {
  const { title, description } = req.body;
  const loggedInId = req.user.id;

  if (!title) {
    return res
      .status(400)
      .json({ status: "error", msg: "Please fill in the tile" });
  }

  try {
    const pool = await connectDB();

    const insertShopQuery = `INSERT INTO shop (title, businessOwner_id, description) VALUES ($1, $2, $3)`;

    await pool.query(insertShopQuery, [title, loggedInId, description]);

    res.status(200).json({ status: "Success", msg: "Shop Created" });
  } catch (error) {
    console.error("Error creating shop: ", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

module.exports = createShop;
