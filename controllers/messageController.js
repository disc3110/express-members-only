const { validationResult } = require("express-validator");
const Message = require("../models/messageModel");

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