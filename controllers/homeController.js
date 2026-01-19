const Message = require("../models/messageModel");

exports.getHome = async (req, res) => {
  try {
    const messages = await Message.getAllMessages();

    res.render("index", {
      title: "Members Only",
      messages,
    });
  } catch (err) {
    console.error("Error loading home:", err);
    res.status(500).send("Something went wrong.");
  }
};