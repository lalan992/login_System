const express = require("express");
const router = express.Router();
const login = require("../controllers/login");

router.get("/", (req, res) => {
  if (req.session.message === "invalid") {
    res.render("base", { title: "Login System", msg: "Invalid user" });
  } else if (req.session.message === "locked") {
    res.render("base", {
      title: "Login System",
      msg: "Blocked for 24 hours for multiple wrong password.!!",
    });
  } else if(req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.render("base", { title: "Login System" });
  }
});

router.post("/login", login.login);

router.get("/dashboard", (req, res) => {
  // console.log(req.session);
  if (req.session.user) {
    res.render("dashboard", { title: "Dashboard", user: req.session.user });
  } else {
    res.redirect("/");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) res.send("Error....");
    else
      res.render("base", {
        title: "Login System",
        msg: "successfully logout....!",
      });
  });
});
module.exports = router;
