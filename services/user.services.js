const Care = require("../models/models.user");


exports.findUserByEmail = async (email) => {
  const user = await Care.findOne({
    email,
  });
  if (!user) {
    return false;
  }
  return user;
};

exports.findUserByNumber = async (phoneNumber) => {
  const user = await Care.findOne({
    phoneNumber,
  });
  if (!user) {
    return false;
  }
  return user;
};


