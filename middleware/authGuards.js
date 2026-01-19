exports.requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  req.flash("error", "Please log in first.");
  return res.redirect("/login");
};