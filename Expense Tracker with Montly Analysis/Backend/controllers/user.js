const User = require("../models/User");

//signup
const handleUserSignUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    //if email or password is missing
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    //if email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    //add user to database
    await User.create({ email, password: password.toString() });

    console.log("User successfully signed up");
    return res.status(201).json({ message: "New user created sucessfully" });
  } catch (error) {
    console.error("Error signing up user: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//login
const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    //email or password missing
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    //find user by email
    const user = await User.findOne({ email });

    //password check for user authentication
    if (!user || user.password !== password.toString()) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    return res.status(200).json({ message: "User successfully logged in", user });
  } catch (error) {
    console.error("Internal server error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};