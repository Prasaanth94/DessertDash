const express = require("express");
const createShop = require("../controllers/shop");
const { authBusinessOwner } = require("../middleware/auth");

const router = express.Router();

router.put("/createShop", authBusinessOwner, createShop);

module.exports = router;
