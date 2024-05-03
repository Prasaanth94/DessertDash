const connectDB = require("../db/db");

const addToCart = async (req, res) => {
  const { product_id, quantity, product_price } = req.body;
  const loggedInId = req.user.id;
  const product_total_price = quantity * product_price;
  const pool = await connectDB();

  try {
    const addToCartQuery = ` INSERT INTO cart (product_id, user_id, quantity, product_total_price) 
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (product_id, user_id) DO UPDATE
    SET quantity = cart.quantity + $3, product_total_price = cart.product_total_price + $4 `;
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
    const getCartItemsQuery = `SELECT p.product_id, p.product_name, p.price, p.description, c.quantity, c.product_total_price 
    FROM product p 
    JOIN cart c ON p.product_id = c.product_id
    WHERE c.user_id = $1
  `;
    const rows = await pool.query(getCartItemsQuery, [userId]);

    res.status(200).json({ message: "Successfully got cart", row: rows.rows });
  } catch (error) {
    console.error("Error getting cart :", error);
    res.status(500).json({ status: "error", msg: "Internal Server Error" });
  }
};

module.exports = { getCartItems, addToCart };
