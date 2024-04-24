const express = require("express");
const { createShop, getShop } = require("../controllers/shop");
const { authBusinessOwner } = require("../middleware/auth");

const router = express.Router();

router.put("/createShop", authBusinessOwner, createShop);
router.get("/getShop", getShop);

module.exports = router;
