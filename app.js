const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport"); // config later
require("dotenv").config();

const indexRouter = require("./routes/indexRouter");

const app = express();

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

// passport setup 
app.use(passport.initialize());
app.use(passport.session());

// locals for views (flash + user)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("error");
  next();
});

// Routes
app.use("/", indexRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).render("404");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Members Only app listening on http://localhost:${PORT}`);
});