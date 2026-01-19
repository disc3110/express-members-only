const express = require("express");
const { body } = require("express-validator");
const messageController = require("../controllers/messageController");
const { requireAuth, requireAdmin } = require("../middleware/authGuards");

const router = express.Router();

const newMessageValidators = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ max: 200 }).withMessage("Title is too long")
    .escape(),
  body("body")
    .trim()
    .notEmpty().withMessage("Message text is required"),
];

router.get("/messages/new", requireAuth, messageController.getNewMessage);
router.post(
  "/messages",
  requireAuth,
  newMessageValidators,
  messageController.postNewMessage
);

router.delete(
  "/messages/:id",
  requireAuth,
  requireAdmin,
  messageController.deleteMessage
);

module.exports = router;