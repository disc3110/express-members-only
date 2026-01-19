const { validationResult } = require("express-validator");
const User = require("../models/userModel");

exports.getAdmin = (req, res) => {
  res.render("auth/admin", {
    title: "Become admin",
    errors: [],
  });
};

exports.postAdmin = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("auth/admin", {
      title: "Become admin",
      errors: errors.array(),
    });
  }

  const entered = req.body.passcode;
  const correct = process.env.ADMIN_PASSCODE;

  if (entered !== correct) {
    return res.status(400).render("auth/admin", {
      title: "Become admin",
      errors: [{ msg: "Wrong admin passcode." }],
    });
  }

  await User.setAdminStatus(req.user.id, true);

  req.flash("success", "You are now an admin.");
  return res.redirect("/dashboard");
};