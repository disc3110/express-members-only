const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const passport = require("passport");

exports.getSignup = (req, res) => {
  res.render("auth/signup", {
    title: "Sign up",
    errors: [],
    formData: {},
  });
};

exports.postSignup = async (req, res) => {
  const errors = validationResult(req);

  const formData = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  if (!errors.isEmpty()) {
    return res.status(400).render("auth/signup", {
      title: "Sign up",
      errors: errors.array(),
      formData,
    });
  }

  try {
    const existingUser = await User.findByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).render("auth/signup", {
        title: "Sign up",
        errors: [{ msg: "Username already taken", param: "username" }],
        formData,
      });
    }

    const existingEmail = await User.findByEmail(req.body.email);
    if (existingEmail) {
      return res.status(400).render("auth/signup", {
        title: "Sign up",
        errors: [{ msg: "Email already in use", param: "email" }],
        formData,
      });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    await User.createUser({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      passwordHash,
    });

    req.flash("success", "Account created! You can now log in.");
    res.redirect("/login");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).render("auth/signup", {
      title: "Sign up",
      errors: [{ msg: "Something went wrong. Please try again." }],
      formData,
    });
  }
};

exports.getLogin = (req, res) => {
  res.render("auth/login", {
    title: "Log in",
    errors: [],
    formData: { username: "" },
  });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).render("auth/login", {
        title: "Log in",
        errors: info ? [{ msg: info.message }] : [{ msg: "Login failed." }],
        formData: { username: req.body.username || "" },
      });
    }

    req.logIn(user, (err2) => {
      if (err2) return next(err2);
      req.flash("success", "Welcome back!");
      return res.redirect("/dashboard");
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success", "You have been logged out.");
    res.redirect("/");
  });
};