const Client = require("../models/models.user");

exports.findUserByEmail = async (email) => {
  const user = await Client.findOne({
    email,
  });
  if (!user) {
    return false;
  }
  return user;
};

exports.findUserByNumber = async (phoneNumber) => {
  const user = await Client.findOne({
    phoneNumber,
  });
  if (!user) {
    return false;
  }
  return user;
};
