const JWT = require("jsonwebtoken");
const generateRefreshToken = (id) => {
  return JWT.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2d" });
};
module.exports = { generateRefreshToken };
