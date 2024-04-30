const express = require("express");
const {
  createShop,
  getShop,
  getShopByName,
  getShopByShopId,
} = require("../controllers/shop");
const { authBusinessOwner } = require("../middleware/auth");

const router = express.Router();

router.put("/createShop", authBusinessOwner, createShop);
router.get("/getShop", getShop);
router.get("/getShopByName/:title", getShopByName);
router.get("/getShopById/:shop_id", getShopByShopId);

module.exports = router;
