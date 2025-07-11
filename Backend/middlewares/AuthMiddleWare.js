const User = require("../models/UsersModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// This function checks whether the user is logged in or not
module.exports.userVerification = (req, res) => {
  const token = req.cookies.token; // Get the token from browser cookies
  if (!token) {
    return res.json({ status: false }); // If there is no token, user is not logged in
  }
  // Verify the token using the secret key
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false }); // If token is invalid or expired
    } else {
      const user = await User.findById(data.id); // If token is valid, find the user in the database using ID from token
      // If user exists, send success and username
      if (user) return res.json({ status: true, user: user.username });
      else return res.json({ status: false });
    }
  });
};

module.exports.isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    if (!decoded.isAdmin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    next();
  } catch (err) {
    console.error("Admin check error:", err);
    res.status(401).json({ message: "Invalid token or unauthorized." });
  }
};
