exports.requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  req.flash("error", "Please log in first.");
  return res.redirect("/login");
};

exports.requireAdmin = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  req.flash("error", "You are not authorized to do that.");
  return res.redirect("/");
};