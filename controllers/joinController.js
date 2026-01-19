const { validationResult } = require("express-validator");
const User = require("../models/userModel");

exports.getJoin = (req, res) => {
  res.render("auth/join", {
    title: "Join the club",
    errors: [],
    formData: {},
  });
};

exports.postJoin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("auth/join", {
      title: "Join the club",
      errors: errors.array(),
      formData: {},
    });
  }

  const entered = req.body.passcode;
  const correct = process.env.MEMBER_PASSCODE;

  if (entered !== correct) {
    return res.status(400).render("auth/join", {
      title: "Join the club",
      errors: [{ msg: "Wrong passcode." }],
      formData: {},
    });
  }

  await User.setMembershipStatus(req.user.id, true);

  req.flash("success", "🎉 Welcome! You are now a club member.");
  return res.redirect("/dashboard");
};