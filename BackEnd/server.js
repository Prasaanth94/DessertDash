const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/db/db");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const auth = require("./src/routers/auth");
const shop = require("./src/routers/shop");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeader: false,
});

connectDB();
const app = express();

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/api", shop);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});
