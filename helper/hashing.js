const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports.passwordHash = async (data) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(data, salt);
    return hash;
  } catch (error) {
    return false;
  }
};

module.exports.passwordCompare = async (data, hash) => {
  const isMatchPassword = await bcrypt.compare(data, hash);
  return isMatchPassword;
};
