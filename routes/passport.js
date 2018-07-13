const express = require("express");
const router = express.Router();
const flash = require("connect-flash");
const passport = require("passport");
const path = require("path");
// router.use(flash());

// As with any middleware it is quintessential to call next()
// if the user is authenticated
const isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};

/* GET login page. */
router.get("/", function(req, res) {
  // Display the Login page with any flash message, if any
  // res.render("index", { message: req.flash("message") });
  console.log("get home");
  
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

/* Handle Login POST */
router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/home",
    failureRedirect: "/",
    failureFlash: true
  })
);

/* GET Registration Page */
router.get("/signup", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/signup.html"));
});

router.get("/failure", function(req,res){
  console.log("failure route");
  res.sendFile(path.join(__dirname, "../public/failed.html")); 
})

/* Handle Registration POST */
router.post("/api/signup", passport.authenticate("signup", {
    successRedirect: "/home",
    failureRedirect: "/failure",
  }), function(req, res){
    console.log("success");
    res.redirect("/home");
  });

router.get("/signout", function(req, res) {
  req.logout();
  res.redirect("/");
});

/* GET Home Page */
router.get("/home", isAuthenticated, function(req, res) {
  res.send(path.join(__dirname, "../public/madeit.html"))
});

module.exports = router;
