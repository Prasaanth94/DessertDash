const express = require("express");
const {
  addProduct,
  toggleProductAvailability,
  deleteProduct,
} = require("../controllers/product");
const { authBusinessOwner } = require("../middleware/auth");

const router = express.Router();

router.put("/addProduct", authBusinessOwner, addProduct);
router.patch(
  "/updateAvailability",
  authBusinessOwner,
  toggleProductAvailability
);

router.delete("/deleteProduct", authBusinessOwner, deleteProduct);

module.exports = router;
