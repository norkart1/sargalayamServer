const express = require("express");
const router = express.Router();

const adminController = require("../Controller/admin")

router.post("/login", adminController.login);
router.post("/logout", adminController.logout);

module.exports = router;
