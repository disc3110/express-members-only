exports.getHome = (req, res) => {
  res.render("index", {
    title: "Members Only",
  });
};