const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { linkSchema } = require("../validators/link.validator");
const { createLink, getLinks, clickLink, toggleFavorite, deleteLink } = require("../controllers/link.controller");

router.use(authMiddleware);

router.post("/", validate(linkSchema), createLink);
router.get("/", getLinks);
router.patch("/:id/click", clickLink);
router.patch("/:id/favorite", toggleFavorite);
router.delete("/:id", deleteLink);

module.exports = router;