const express = require("express");
const { body } = require("express-validator");
const joinController = require("../controllers/joinController");
const { requireAuth } = require("../middleware/authGuards");

const router = express.Router();

router.get("/join", requireAuth, joinController.getJoin);

router.post(
  "/join",
  requireAuth,
  body("passcode").trim().notEmpty().withMessage("Passcode is required"),
  joinController.postJoin
);

module.exports = router;