const express = require("express");
const getAllAddress = require("../controllers/addressess");

const router = express.Router();

router.get("/allAddress", getAllAddress);

module.exports = router;
