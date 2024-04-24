const express = require("express");
const {
  addProduct,
  toggleProductAvailability,
} = require("../controllers/product");
const { authBusinessOwner } = require("../middleware/auth");

const router = express.Router();

router.put("/addProduct", authBusinessOwner, addProduct);
router.patch(
  "/updateAvailability",
  authBusinessOwner,
  toggleProductAvailability
);

module.exports = router;
