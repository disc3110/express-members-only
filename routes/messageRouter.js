const express = require("express");
const { body } = require("express-validator");
const messageController = require("../controllers/messageController");
const { requireAuth, requireAdmin, requireMember } = require("../middleware/authGuards");

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

const editMessageValidators = newMessageValidators;

const commentValidators = [
  body("commentBody")
    .trim()
    .notEmpty().withMessage("Comment cannot be empty"),
];


router.get("/messages/new", requireAuth, messageController.getNewMessage);
router.post(
  "/messages",
  requireAuth,
  newMessageValidators,
  messageController.postNewMessage
);

router.get("/messages/:id", requireAuth, requireMember, messageController.getMessage);

router.put(
  "/messages/:id",
  requireAuth,
  editMessageValidators,
  messageController.updateMessage
);

router.delete(
  "/messages/:id",
  requireAuth,
  requireAdmin,
  messageController.deleteMessage
);

// comments
router.post(
  "/messages/:id/comments",
  requireAuth,
  requireMember,
  commentValidators,
  messageController.postComment
);

router.delete(
  "/comments/:id",
  requireAuth,
  requireAdmin,
  messageController.deleteComment
);

module.exports = router;