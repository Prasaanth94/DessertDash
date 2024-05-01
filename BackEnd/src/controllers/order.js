const connectDB = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const moveToOrder = async (req, res) => {
  const loggedInId = req.user.id;
  const productIds = req.body.product_ids;
  const order_id = uuidv4();

  try {
    const pool = await connectDB();

    // Construct a SQL query to join the cart and product tables
    const moveToOrderQuery = `
        SELECT c.*, p.shop_id 
        FROM cart c
        INNER JOIN product p ON c.product_id = p.product_id
        WHERE c.product_id IN (${productIds
          .map((_, index) => `$${index + 1}`)
          .join(",")})
      `;

    const { rows } = await pool.query(moveToOrderQuery, productIds);

    if (rows.length === 0) {
      return res.status(400).json({
        status: "error",
        msg: "Can't find any cart items with the provided product IDs",
      });
    }

    // Insert the fetched cart items into the order_table
    for (const item of rows) {
      const insertOrderQuery = `
          INSERT INTO checkout (user_id, product_id, shop_id, quantity, total_price)
          VALUES ($1, $2, $3, $4, $5 )
        `;
      await pool.query(insertOrderQuery, [
        item.user_id,
        item.product_id,
        item.shop_id,
        item.quantity,
        item.product_total_price,
      ]);
    }

    // Delete rows from the cart table after successfully moving to the order table
    const deleteFromCartQuery = `
        DELETE FROM cart
        WHERE user_id = $1 AND product_id IN (${productIds
          .map((_, index) => `$${index + 2}`)
          .join(",")})
        `;
    await pool.query(deleteFromCartQuery, [loggedInId, ...productIds]);

    res.status(200).json({ status: "success", data: rows });
  } catch (error) {
    console.error("Error moving items to order:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const getUserOrder = async (req, res) => {
  const user_id = req.user.id;

  try {
    const pool = await connectDB();

    // Query to retrieve orders for the user
    const getUserOrderQuery = `SELECT * FROM checkout WHERE user_id = $1`;
    const { rows: orders } = await pool.query(getUserOrderQuery, [user_id]);

    if (orders.length === 0) {
      return res.status(400).json({ status: "error", msg: "No orders found" });
    }

    // Extracting product IDs from orders
    const productIds = orders.map((order) => order.product_id);

    // Query to retrieve products for the obtained product IDs
    const getProductQuery = `SELECT * FROM product WHERE product_id IN (${productIds
      .map((_, index) => `$${index + 1}`)
      .join(",")})`;
    const { rows: products } = await pool.query(getProductQuery, productIds);

    // Query to retrieve shop details for the obtained shop IDs
    const shopIds = products.map((product) => product.shop_id);
    const getShopQuery = `SELECT * FROM shop WHERE shop_id IN (${shopIds
      .map((_, index) => `$${index + 1}`)
      .join(",")})`;
    const { rows: shops } = await pool.query(getShopQuery, shopIds);

    // Mapping products to their respective orders and adding shop details
    const ordersWithProductsAndShops = orders.map((order) => {
      const product = products.find(
        (product) => product.product_id === order.product_id
      );
      const shop = shops.find((shop) => shop.shop_id === product.shop_id);
      return {
        ...order,
        product,
        shop,
      };
    });

    res
      .status(200)
      .json({ status: "success", data: ordersWithProductsAndShops });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

module.exports = { moveToOrder, getUserOrder };
