const express = require("express");
const { handleUserSignUp, handleUserLogin } = require("../controllers/user");
const userRoute = express.Router();

//signup
userRoute.post("/signup", handleUserSignUp);
//login
userRoute.post("/login", handleUserLogin);

module.exports = userRoute;