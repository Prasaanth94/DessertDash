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
// Failed update
// const updateProduct = async (req, res) => {
//   const { product_id, product_name, description, price } = req.body;
//   const loggedInId = req.user.id;
//   console.log("Price: ", price);

//   if (!product_id) {
//     return res
//       .status(400)
//       .json({ status: "error", msg: "Product Id is required" });
//   }

//   if (!product_name && !description && !price) {
//     return res
//       .status(400)
//       .json({ status: "error", msg: "Please Fill up atleast one field" });
//   }

//   try {
//     const pool = await connectDB();

//     const checkOwnershipQuery = `SELECT shop_id FROM product WHERE product_id = $1 AND shop_id IN (SELECT shop_id FROM shop WHERE business_owner_id = $2)`;
//     const ownerShipResult = await pool.query(checkOwnershipQuery, [
//       product_id,
//       loggedInId,
//     ]);

//     if (ownerShipResult.rows.length === 0) {
//       return res
//         .status(400)
//         .json({ status: "error", msg: "You do not have permission to update" });
//     }

//     const updateFields = [];
//     const updateValues = [];

//     if (product_name) {
//       updateFields.push(`product_name = $1`);
//       updateValues.push(product_name);
//     }

//     if (price) {
//       updateFields.push("price = $2"); // Explicit casting to numeric
//       updateValues.push(price);
//     }

//     if (description) {
//       updateFields.push("description = $3");
//       updateValues.push(description);
//     }
//     console.log(price);
//     // const updateProductQuery = `UPDATE product SET ${updateFields
//     //   .map((field, index) => `${field} = $  ${index + 1}`)
//     //   .join(", ")} WHERE product_id = $${updateFields.length + 1}`;

//     const updateProductQuery = `UPDATE product SET price = $2 = $1 WHERE product_id = $2`;
//     console.log(updateProductQuery);
//     await pool.query(updateProductQuery, [...updateValues, product_id]);
//     res.status(200).json({ message: "Product successfully updated" });
//   } catch (error) {
//     console.error("Error updating product: ", error);
//     res.status(500).json({ status: "Error", msg: "Internal Server Error" });
//   }
// };

const updateProduct = async (req, res) => {
  const { product_id, product_name, description, price } = req.body;
  const loggedInId = req.user.id;

  if (!product_id) {
    return res
      .status(400)
      .json({ status: "error", msg: "Product Id is required" });
  }

  try {
    const pool = await connectDB();

    // Check if the logged-in user has ownership of the product
    const checkOwnershipQuery = `
        SELECT p.shop_id 
        FROM product p 
        INNER JOIN shop s ON p.shop_id = s.shop_id 
        WHERE p.product_id = $1 AND s.business_owner_id = $2
      `;
    const ownershipResult = await pool.query(checkOwnershipQuery, [
      product_id,
      loggedInId,
    ]);

    if (ownershipResult.rows.length === 0) {
      return res
        .status(403)
        .json({
          status: "error",
          msg: "You do not have permission to update this product",
        });
    }

    // Construct the update query
    const updateProductQuery = `
        UPDATE product 
        SET 
          product_name = COALESCE($2, product_name),
          description = COALESCE($3, description),
          price = COALESCE($4, price)
        WHERE 
          product_id = $1
      `;

    // Execute the update query
    const updateResult = await pool.query(updateProductQuery, [
      product_id,
      product_name,
      description,
      price,
    ]);

    // Check if any rows were affected
    if (updateResult.rowCount === 0) {
      return res
        .status(404)
        .json({
          status: "error",
          msg: "Product not found or no changes applied",
        });
    }

    res
      .status(200)
      .json({ status: "success", msg: "Product successfully updated" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ status: "error", msg: "Internal Server Error" });
  }
};

const getProduct = async (req, res) => {
  const { shop_id } = req.query;

  try {
    const pool = await connectDB();
    const getProductQuery = `SELECT * FROM product WHERE shop_id = $1`;
    const { rows } = await pool.query(getProductQuery, [shop_id]);

    if (rows.length === 0) {
      return res.status(400).json({ messege: "Products not found" });
    }

    const products = rows;
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting product: ", error);
    res.status(400).json({ status: "errror", msg: "Internal Server Error" });
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

module.exports = {
  addProduct,
  toggleProductAvailability,
  deleteProduct,
  getProduct,
  updateProduct,
};
