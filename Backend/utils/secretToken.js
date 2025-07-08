require("dotenv").config();
const jwt = require("jsonwebtoken"); // Import jsonwebtoken to create and manage JWT tokens

// Exporting a function to create a JWT token using the user's ID
module.exports.createSecretToken = (id) => {
  // Generate a token by signing the user's ID with a secret key
  // Payload: what you want to encode (here, user ID)
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

module.exports.emailVerificationToken = (id) => {
  return jwt.sign({ id }, process.env.EMAIL_SECRET, {
    expiresIn: "1h", // Short-lived
  });
};

module.exports.createResetToken = (id) => {
  return jwt.sign({ id }, process.env.RESET_SECRET, {
    expiresIn: "10m",
  });
};
