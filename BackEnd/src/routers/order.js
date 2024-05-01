const express = require("express");
const { moveToOrder, getUserOrder } = require("../controllers/order");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.post("/moveToOrder", authUser, moveToOrder);
router.get("/getUserOrder", authUser, getUserOrder);

module.exports = router;
