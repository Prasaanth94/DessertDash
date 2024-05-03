const express = require("express");
const { addToCart, getCartItems } = require("../controllers/cart");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.put("/addToCart", authUser, addToCart);
router.get("/getCart", authUser, getCartItems);

module.exports = router;
