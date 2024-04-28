const connectDB = require("../db/db");

const addProduct = async (req, res) => {
  const { product_name, price, description } = req.body;
  const loggedInId = req.user.id;
  console.log(req.user.id);
  if (!product_name || !price) {
    return res
      .status(400)
      .json({ status: "error", msg: "Please fill in required fills" });
  }

  try {
    const pool = await connectDB();

    const getShopIdquery = `SELECT shop_id FROM shop WHERE business_owner_id =$1`;
    const result = await pool.query(getShopIdquery, [loggedInId]);
    console.log(result);

    const createProductQuery = `INSERT INTO product(product_name, price, description, shop_id) VALUES ($1,$2,$3,$4)`;
    await pool.query(createProductQuery, [
      product_name,
      price,
      description,
      result.rows[0].shop_id,
    ]);

    res.status(200).json({ message: "Item succesfully created" });
  } catch (error) {
    console.error("Error creating product", error);
    res.status(400).json({ status: "error", msg: "Internal Server Error" });
  }
};

const toggleProductAvailability = async (req, res) => {
  const { product_id } = req.body;

  try {
    const pool = await connectDB();

    const toggleAvailabilityQuery = `UPDATE product SET availability = CASE WHEN availability = true THEN false ELSE true END WHERE id =$1`;
    await pool.query(toggleAvailabilityQuery, [product_id]);
    res.status(200).json({ message: "Status updated" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: "error", msg: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  const { product_id } = req.body;

  try {
    const pool = await connectDB();

    const deleteProduct = `DELETE FROM product where id=$1`;
    await pool.query(deleteProduct, [product_id]);
    res.status(200).json({ message: "Succesfully Deleted Product" });
  } catch (error) {
    console.error("Error Deleting product: ", error);
    res.status(400).json({ status: "error", msg: "internal server errro" });
  }
};

module.exports = { addProduct, toggleProductAvailability, deleteProduct };
