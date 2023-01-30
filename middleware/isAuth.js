const jwt = require("jsonwebtoken");
const Client = require("../models/models.user");
const dotenv = require("dotenv");
dotenv.config();
const { JWT_SECRET } = process.env;
const mongoose = require("mongoose");

exports.isAuth = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Please log in to continue" });
    }

    const decoded = await jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;

    next();
  } catch (e) {
    return res.status(401).json(`signUp as user || Token expired  \n ${e}`);
  }
};

exports.validateRole = async (req, res, next) => {
  try {
    const user = await Client.findById({ _id: req.user.id });
    console.log(user.role);
    if (user.role !== "seller") {
      return res.status(401).json({ error: "UNATHORIZED!!!" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.validateVerified = async (req, res, next) => {
  try {
    const user = await Client.findOne({ email: req.body.email });
  
    if (!user) {
      return res.status(400).json({
        message: "Invalid Email"
      });
    }
    console.log(user.isVerified);
    if (user.isVerified == "true") {
      next();
    } else {
      return res
        .status(401)
        .json({ error: "Please check your email to verify account" });
    }
  } catch (error) {
    return res.status(409).json({ message: error.message });
  }
};


