const express = require("express");
const { body } = require("express-validator");
const adminController = require("../controllers/adminController");
const { requireAuth } = require("../middleware/authGuards");

const router = express.Router();

router.get("/admin", requireAuth, adminController.getAdmin);

router.post(
  "/admin",
  requireAuth,
  body("passcode").trim().notEmpty().withMessage("Passcode is required"),
  adminController.postAdmin
);

module.exports = router;