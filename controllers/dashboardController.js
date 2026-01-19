// controllers/dashboardController.js
exports.getDashboard = (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
  });
};