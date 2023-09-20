const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const ENV = require("../config/env");

dotenv.config();

const passwordManager = {
  hash: (data) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data, salt);
    return hash;
  },
  comparePwd: (string, hash) => {
    return bcrypt.compareSync(string, hash);
  },
};

class JwtTokenManager {
  constructor() {}

  static genAccessToken(data) {
    const signedToken = jwt.sign(data, ENV.jwtSecret, { expiresIn: "24hr" });
    return signedToken;
  }
  static genRefreshToken(data) {
    const refToken = jwt.sign(data, ENV.jwtSecret, { expiresIn: "1yr" });
    return refToken;
  }
  static verifyToken(token) {
    const decoded = jwt.verify(token, this.encKey);
    return decoded;
  }
}

module.exports = {
  passwordManager,
  JwtTokenManager,
};
