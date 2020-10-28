const express = require("express");
const { ensureAuthenticated } = require("../passportConfig/auth");
const router = express.Router();

// Home
router.get("/", (req, res) => {
  res.status(200).render("welcome", {
    title: "Welcome to BookStore",
  });
});

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.status(200).render("dashboard", {
    title: "Dashboard",
    user: req.user.name,
  });
});

module.exports = router;
