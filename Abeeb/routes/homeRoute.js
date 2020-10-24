const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).render("welcome", {
    title: "Welcome to BookStore",
  });
});

module.exports = router;
