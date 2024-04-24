const express = require("express");
const {
  registerUser,
  login,
  refresh,
  seedUsers,
} = require("../controllers/auth");

const router = express.Router();

router.put("/register", registerUser);
router.post("/login", login);
router.post("/refresh", refresh);
router.put("/seed", seedUsers);

module.exports = router;
