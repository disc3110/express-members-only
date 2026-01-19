const { validationResult } = require("express-validator");
const Message = require("../models/messageModel");
const Comment = require("../models/commentModel");

exports.getMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.getMessageById(id);
    if (!message) {
      return res.status(404).render("404");
    }

    const comments = await Comment.getCommentsByMessageId(id);

    res.render("messages/show", {
      title: message.title,
      message,
      comments,
      errors: [],
      editFormData: {
        title: message.title,
        body: message.body,
      },
    });
  } catch (err) {
    console.error("Error loading message:", err);
    res.status(500).send("Something went wrong.");
  }
};

exports.getNewMessage = (req, res) => {
  res.render("messages/new", {
    title: "Create new message",
    errors: [],
    formData: { title: "", body: "" },
  });
};

exports.postNewMessage = async (req, res) => {
  const errors = validationResult(req);
  const formData = {
    title: req.body.title,
    body: req.body.body,
  };

  if (!errors.isEmpty()) {
    return res.status(400).render("messages/new", {
      title: "Create new message",
      errors: errors.array(),
      formData,
    });
  }

  try {
    await Message.createMessage({
      userId: req.user.id,
      title: req.body.title,
      body: req.body.body,
    });

    req.flash("success", "Message created!");
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).render("messages/new", {
      title: "Create new message",
      errors: [{ msg: "Something went wrong. Please try again." }],
      formData,
    });
  }
};

exports.deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    await Message.deleteMessage(id);
    req.flash("success", "Message deleted.");
  } catch (err) {
    console.error("Error deleting message:", err);

    // FK violation if there are comments referencing this message
    if (err.code === "23503") {
      req.flash("error", "Cannot delete this message because it has comments.");
    } else {
      req.flash("error", "Could not delete message.");
    }
  }

  return res.redirect("/");
};

exports.updateMessage = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);

  try {
    const message = await Message.getMessageById(id);
    if (!message) {
      return res.status(404).render("404");
    }

    // only author or admin
    if (req.user.id !== message.user_id && !req.user.is_admin) {
      req.flash("error", "You cannot edit this message.");
      return res.redirect(`/messages/${id}`);
    }

    const comments = await Comment.getCommentsByMessageId(id);

    if (!errors.isEmpty()) {
      return res.status(400).render("messages/show", {
        title: message.title,
        message,
        comments,
        errors: errors.array(),
        editFormData: {
          title: req.body.title,
          body: req.body.body,
        },
      });
    }

    const updated = await Message.updateMessage({
      id,
      title: req.body.title,
      body: req.body.body,
    });

    req.flash("success", "Message updated.");
    return res.redirect(`/messages/${updated.id}`);
  } catch (err) {
    console.error("Error updating message:", err);
    req.flash("error", "Could not update message.");
    return res.redirect(`/messages/${id}`);
  }
};

exports.postComment = async (req, res) => {
  const { id } = req.params; // message id
  const errors = validationResult(req);

  try {
    const message = await Message.getMessageById(id);
    if (!message) {
      return res.status(404).render("404");
    }

    const comments = await Comment.getCommentsByMessageId(id);

    if (!errors.isEmpty()) {
      return res.status(400).render("messages/show", {
        title: message.title,
        message,
        comments,
        errors: errors.array(),
        editFormData: {
          title: message.title,
          body: message.body,
        },
      });
    }

    await Comment.createComment({
      messageId: id,
      userId: req.user.id,
      body: req.body.commentBody,
    });

    req.flash("success", "Comment added.");
    return res.redirect(`/messages/${id}`);
  } catch (err) {
    console.error("Error creating comment:", err);
    req.flash("error", "Could not add comment.");
    return res.redirect(`/messages/${id}`);
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params; // comment id
  const { messageId } = req.query;

  try {
    await Comment.deleteComment(id);
    req.flash("success", "Comment deleted.");
  } catch (err) {
    console.error("Error deleting comment:", err);
    req.flash("error", "Could not delete comment.");
  }

  return res.redirect(`/messages/${messageId || ""}`);
};