const express = require("express");
const {
  createShop,
  getShop,
  getShopByName,
  getShopByShopId,
  getNearByShop,
} = require("../controllers/shop");
const { authBusinessOwner, authUser } = require("../middleware/auth");

const router = express.Router();

router.put("/createShop", authBusinessOwner, createShop);
router.get("/getShop", getShop);
router.get("/getShopByName/:title", getShopByName);
router.get("/getShopById/:shop_id", getShopByShopId);
router.post("/getNearByShop", authUser, getNearByShop);

module.exports = router;
