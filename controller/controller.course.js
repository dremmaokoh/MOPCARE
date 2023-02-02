const Care = require("../models/models.user");
const Course = require("../models/models.course");
const cloudinary = require("../utils/cloudinary");

exports.addCourse = async (req, res, next) => {
  try {
    const { title, details, link, category} = req.body;
    const id = req.user.id;

    /* Finding the user by the id. */
    const checkUser = await Care.findOne({ _id: id });
    if (!checkUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (checkUser.role !== "admin") {
      return res.status(404).json({ message: "Unauthorized" });
    }


    const new_course = await Course.create({
      title,
      details,
      link,
      category
    });

    return res.status(201).json(new_course);
  } catch (error) {
    next(error);
  }
};

exports.findSingleCourse = async (req, res, next) => {
  try {
    const id = req.params.id;
    const find_product = await Course.findById({ _id: id });
    const product_find = {
      message: "Product Found",
      find_product,
    };
    return res.status(200).json(product_find);
  } catch (error) {
    next(error);
  }
};

exports.findCourses = async (req, res, next) => {
  try {
    let { page, size, sort } = req.query;

    // If the page is not applied in query
    if (!page) {
      page = 1;
    }

    if (!size) {
      size = 10;
    }
    const limit = parseInt(size);
    const latest = await Course.find().sort({ _id: 1 }).limit(limit);

    res.send({
      page,
      size,
      Info: latest,
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.similarField = async (req, res, next) => {
  try {
    const category = req.params.category;
    const { page, limit } = req.query;
    const similar_field = await Course.find({ category: category })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit * 1);
    return res
      .status(200)
      .json({ count: similar_field.length, data: similar_field });
  } catch (error) {
    next(error);
  }
};
