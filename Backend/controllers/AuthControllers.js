const UsersModel = require("../models/UsersModel.js");
const {
  createSecretToken,
  emailVerificationToken,
  createResetToken,
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
    const token = createSecretToken(user._id, user.isAdmin);
    // Set the token in cookie
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
      sameSite: "Lax",
    });
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        secure: process.env.NODE_ENV === "production",
      },
    });
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

module.exports.ForgotPass = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UsersModel.findOne({ email });
    if (!user) {
      return res.json({ message: "No User exists with the email" });
    }

    const token = createResetToken(user._id);
    const resetPassUrl = `http://localhost:5173/forgotpass?token=${token}`;
    await sendEmail(
      user.email,
      "Reset Your Password - PizzaForge",
      `<p>Click below to reset your password:</p>
     <a href="${resetPassUrl}">Reset Password</a>`
    );

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    return res.json({ status: false });
  }
};

module.exports.ResetPass = async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.json({ status: false });
  }
  try {
    const allowReset = jwt.verify(token, process.env.RESET_SECRET);
    const { password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const updatedUser = await UsersModel.findByIdAndUpdate(allowReset.id, {
      password: hashedPassword,
    });

    if (updatedUser) {
      return res.json({ message: "Password changed successfully" });
    } else {
      return res.json({ message: "User not found" });
    }
  } catch (error) {
    return res.json({ status: false, message: "Token expired or invalid" });
  }
};
