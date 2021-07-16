const express = require("express");
const libControllers = require("../controllers");
const router = express.Router();


router.post("/signup", libControllers.SignUpUser);
router.post("/login", libControllers.LoginUser);


module.exports = router;
