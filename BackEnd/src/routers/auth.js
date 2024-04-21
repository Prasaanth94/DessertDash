const express = require("express");
const { registerUser, login, refresh } = require("../controllers/auth");

const router = express.Router();

router.put("/register", registerUser);
router.post("/login", login);
router.post("/refresh", refresh);

module.exports = router;
