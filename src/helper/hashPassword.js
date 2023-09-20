const bcrypt = require("bcryptjs");

const encryptPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

module.exports = {
  encryptPassword,
  comparePassword,
};
