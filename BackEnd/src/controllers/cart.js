const connectDB = require("../db/db");

const addToCart = async (req, res) => {
  const { product_id, quantity, product_total_price } = req.body;
  const loggedInId = req.user.id;
  const pool = await connectDB();

  try {
    const addToCartQuery = `INSERT INTO cart (product_id, user_id, quantity, product_total_price) VALUES ($1,$2,$3,$4) `;
    await pool.query(addToCartQuery, [
      product_id,
      loggedInId,
      quantity,
      product_total_price,
    ]);

    res.status(200).json({ message: "Succesfully added to cart" });
  } catch (error) {
    console.error("Error adding to cart: ", error);
    res.status(500).json({ status: "error", msg: "Internal Server Error" });
  }
};

const getCartItems = async (req, res) => {
  const userId = req.user.id;
  const pool = await connectDB();
  try {
    const getCartItemsQuery = `SELECT p.product_name, p.price, p.description FROM product p JOIN cart c on p.product_id = c.product_id
    WHERE c.user_id = $1 `;
    const rows = await pool.query(getCartItemsQuery, [userId]);
    console.log(rows);

    res.status(200).json({ message: "Successfully got cart", row: rows.rows });
  } catch (error) {
    console.error("Error getting cart :", error);
    res.status(500).json({ status: "error", msg: "Internal Server Error" });
  }
};

module.exports = { getCartItems, addToCart };
