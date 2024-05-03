const express = require("express");
const getUserRole = require("../controllers/user");

const router = express.Router();

router.get("/getUserRole", getUserRole);

module.exports = router;
