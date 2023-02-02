const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Care = require("../models/models.user");
const cloudinary = require("../utils/cloudinary");
const { passwordHash, passwordCompare } = require("../helper/hashing");
const { jwtSign } = require("../helper/jwt");
const {
  findUserByEmail,
  findUserByNumber,
} = require("../services/user.services");

const transporter = nodemailer.createTransport({
  service: process.env.MAIL,
  auth: {
    user: process.env.USER_MAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.signUp = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      phoneNumber,
      role,
      profilePicture,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber 
    ) {
      return res.status(409).json({
        message: "Please Fill All Fields",
      });
    }


    if (password != confirmPassword) {
      return res.status(409).json({
        message: "The entered passwords do not match!",
      });
    }

    const isExisting = await findUserByEmail(email);
    if (isExisting) {
      return res.status(409).json({
        message: "Email Already existing",
      });
    }
    const sameNumber = await findUserByNumber(phoneNumber);
    if (sameNumber) {
      return res.status(409).json({
        message: "Phone Number Already existing",
      });
    }
    const hashedPassword = await passwordHash(password);
    const result = await cloudinary.uploader.upload(req.file.path);

    const user = new Care({
      firstname,
      lastname,
      email,
      phoneNumber,
      password: hashedPassword,
      profilePicture: result.secure_url,
      emailtoken: crypto.randomBytes(64).toString("hex"),
      role,
      isVerified: false,
    });
    const new_user = await user.save();

    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to rake our messages");
          resolve(success);
        }
      });
    });

    const mailOptions = {
      from: ' "Verify your email" <process.env.USER_MAIL>',
      to: user.email,
      subject: "Mopcare - Verify your email",
      html: `<h2> ${user.firstname} ${user.lastname} </h2> 
              <h2> Thank you for registering on our site  </h2> 
             <h4> Please verify your mail to continue..... </h4>
            <a href="${process.env.CLIENT_URL}/api/verify-email?token=${user.emailtoken}">Verify Your Email</a>   `,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(err);
        } else {
          console.log("Email Sent");
          resolve(info);
        }
      });
    });

    const user_info = {
      message: "Verfication link is sent to your email",
      new_user,
    };
    return res.status(201).json(user_info);
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.query.token;
    const user = await Care.findOne({ emailtoken: token });
    if (user) {
      user.emailtoken = null;
      user.isVerified = true;
      await user.save();
      const user_info = {
        message: "Email Verfication Successful",
      };
      return res.status(201).json(user_info);
    }
    if (user.isVerified !== "false") {
      return res.status(401).json({ error: "Email Already Verified" });
    } else {
      const no_verify = {
        message: "Email Verfication Not Successful",
      };
      return res.status(409).json(no_verify);
    }
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(409).json({
        message: "Please Fill All Fields",
      });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }
    const isMatch = await passwordCompare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const payload = {
      id: user._id,
    };

    const token = jwtSign(payload);
    res.cookie("access_token", token);
    const dataInfo = {
      status: "success",
      message: "Login success",
      access_token: token,
    };
    return res.status(200).json(dataInfo);
  } catch (error) {
    next(error);
  }
};

exports.logOut = async (req, res) => {
  res.clearCookie("access_token");
  const logout = {
    message: "Logout Successful",
  };
  return res.status(201).json(logout);
};

exports.findAllUsers = async (req, res) => {
  try {
    let { page, size, sort } = req.query;

    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 5;
    }
    const limit = parseInt(size);
    const users = await Care.find().sort({ _id: 1 }).limit(limit);

    res.send({
      page,
      size,
      Info: users,
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.finduser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const find_user = await Care.findById({ _id: id });
    const user_find = {
      message: "User Found",
      find_user,
    };
    return res.status(200).json(user_find);
  } catch (error) {
    next(error);
  }
};

exports.switchRole = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(409).json({
        message: "User not found",
      });
    }
    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }
    user.role = "admin";
    await user.save();
    res.status(200).json({ message: "User role changed to admin" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const { firstname,
      lastname,
      phoneNumber,
      profilePicture, } =
      req.body;
      const result = await cloudinary.uploader.upload(req.file.path);
    const new_user = await Care.findByIdAndUpdate(
      { _id: id },
      { firstname,
        lastname,
        phoneNumber,
        profilePicture :result.secure_url },
      {
        new: true,
      }
    );
    const user_update = {
      message: "Data updated successfully",
      new_user,
    };
    return res.status(200).json(user_update);
  } catch (error) {
    next(error);
  }
};