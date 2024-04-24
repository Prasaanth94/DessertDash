const connectDB = require("../db/db");

const createShop = async (req, res) => {
  const { title, description, location } = req.body;
  const loggedInId = req.user.id;

  if (!title) {
    return res
      .status(400)
      .json({ status: "error", msg: "Please fill in the tile" });
  }

  try {
    const pool = await connectDB();

    const insertShopQuery = `INSERT INTO shop (title, businessOwner_id, description) VALUES ($1, $2, $3)  RETURNING id`;

    const result = await pool.query(insertShopQuery, [
      title,
      loggedInId,
      description,
    ]);

    if (result.rows.length > 0 && result.rows[0].id) {
      const shopId = result.rows[0].id;

      const insertAddressQuery = `INSERT INTO addressess (location, shop_id) VALUES ($1,$2)`;
      await pool.query(insertAddressQuery, [location, shopId]);

      res.status(200).json({ status: "Success", msg: "Shop Created" });
    } else {
      throw new Error("No rows returned form the insert Query");
    }
  } catch (error) {
    console.error("Error creating shop: ", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

const getShop = async (req, res) => {
  const { shop_id } = req.body;

  try {
    const pool = await connectDB();

    const getShopQuery = `SELECT * FROM shop where id = $1`;
    const shop = await pool.query(getShopQuery, [shop_id]);
    res.status(200).json({ message: "succes", shop: shop.rows[0] });
  } catch (error) {
    console.error("Cant get shop: ", error);
    res.status(400).json({ status: "errro", msg: "Internal Server Error" });
  }
};

module.exports = { createShop, getShop };
