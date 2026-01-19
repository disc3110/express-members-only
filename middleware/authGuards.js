exports.requireAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  req.flash("error", "Please log in first.");
  return res.redirect("/login");
};

exports.requireMember = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.membership_status) {
    return next();
  }
  req.flash("error", "You must be a member to access that page.");
  return res.redirect("/join");
};

exports.requireAdmin = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  req.flash("error", "You are not authorized to do that.");
  return res.redirect("/");
};