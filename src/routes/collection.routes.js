const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { createCollection, getCollections, deleteCollection } = require("../controllers/collection.controller");

router.use(authMiddleware);

router.post("/", createCollection);
router.get("/", getCollections);
router.delete("/:id", deleteCollection);

module.exports = router;