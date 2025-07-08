const UsersModel = require("../models/UsersModel.js");
const {
  createSecretToken,
  emailVerificationToken,
} = require("../utils/secretToken.js");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../utils/sendEmail.js");
const jwt = require("jsonwebtoken");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await UsersModel.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await UsersModel.create({
      email,
      password,
      username,
      createdAt,
    });

    const verificationToken = emailVerificationToken(user._id);
    const verificationUrl = `http://localhost:5173/verifyemail?token=${verificationToken}`;
    await sendEmail(
      user.email,
      "Verify your PizzaForge account",
      `<a href="${verificationUrl}">Click here to verify your account</a>`
    );
    res.status(201).json({
      message: "User signed up successfully, Verification Email Sent",
      success: true,
      user,
    });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.json({ message: "Incorrect password or email" });
    }
    if (!user.verified) {
      return res.json({
        message: "Please verify your email before logging in.",
      });
    }

    // Compare entered password with hashed password in DB
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "Incorrect password or email" });
    }
    // If password is correct, create a token
    const token = createSecretToken(user._id);
    // Set the token in cookie
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.VerifyEmail = async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.json({ status: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);

    const user = await UsersModel.findByIdAndUpdate(decoded.id, {
      verified: true,
    });

    if (user) return res.json({ status: true, user: user.username });
  } catch (error) {
    return res.json({ status: false });
  }
};
