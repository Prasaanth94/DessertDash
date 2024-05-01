const express = require("express");
const {
  moveToOrder,
  getUserOrder,
  getOwnerOrder,
  orderCollected,
} = require("../controllers/order");
const { authUser, authBusinessOwner } = require("../middleware/auth");

const router = express.Router();

router.post("/moveToOrder", authUser, moveToOrder);
router.get("/getUserOrder", authUser, getUserOrder);
router.get("/getOwnerOrder/:shop_id", authBusinessOwner, getOwnerOrder);
router.delete("/orderCollected/:product_id", authBusinessOwner, orderCollected);

module.exports = router;
