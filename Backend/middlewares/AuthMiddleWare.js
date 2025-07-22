const User = require("../models/UsersModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token or user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("User verification failed:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
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
