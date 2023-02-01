const mongoose = require("mongoose");
const validator = require("validator");

const careSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please enter a valid firstname"],
    },
    lastname: {
      type: String,
      required: [true, "Please enter a valid surname"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter a valid phone number"],
    },
    email: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (value.toLowerCase().includes("pass")) {
          throw new Error("Passwords cannot contain 'pass'");
        }
      },
    },

    emailtoken: {
      type: String,
    },

    isVerified: {
      type: String,
      enum: ["true", "false"],
      default: "false",
    },
    profilePicture: {
      type: String,
      required: [true, "please enter a valid image"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Care", careSchema);
