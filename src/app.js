const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const linkRoutes = require("./routes/link.routes");
const collectionRoutes = require("./routes/collection.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, try again later" }
});

app.use(limiter);

app.use("/auth", authRoutes);
app.use("/links", linkRoutes);
app.use("/collections", collectionRoutes);

app.get("/", (req, res) => {
    res.json({ message: "LinkVault API running!", version: "2.0" });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});