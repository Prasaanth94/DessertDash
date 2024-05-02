const express = require("express");
const {
  registerUser,
  login,
  refresh,
  seedUsers,
} = require("../controllers/auth");
const { validateRegistrationData } = require("../validators/auth");

const router = express.Router();

router.put("/register", validateRegistrationData, registerUser);
router.post("/login", login);
router.post("/refresh", refresh);
router.put("/seed", seedUsers);

module.exports = router;
