const User = require("../models/UsersModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ status: false });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
      return res.json({ status: false });
    } else {
      const user = await User.findById(data.id);

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
