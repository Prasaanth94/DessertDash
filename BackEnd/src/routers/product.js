const express = require("express");
const {
  addProduct,
  toggleProductAvailability,
  deleteProduct,
  getProduct,
  updateProduct,
} = require("../controllers/product");
const { authBusinessOwner } = require("../middleware/auth");

const router = express.Router();

router.put("/addProduct", authBusinessOwner, addProduct);
router.get("/getProducts", getProduct);
router.patch("/updateProduct", authBusinessOwner, updateProduct);
router.patch(
  "/updateAvailability",
  authBusinessOwner,
  toggleProductAvailability
);

router.delete("/deleteProduct", authBusinessOwner, deleteProduct);

module.exports = router;
