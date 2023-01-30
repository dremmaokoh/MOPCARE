const Client = require("../models/models.user");
const Product = require("../models/models.product");
const cloudinary = require("../utils/cloudinary");

exports.addProduct = async (req, res, next) => {
  try {
    const { description, category, cost, productPicture, isAvailable, title } =
      req.body;
    const id = req.user.id;


    /* Finding the user by the id. */
    const checkUser = await Client.findById({ _id: id });
    if (!checkUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (checkUser.role !== "seller") {
      return res.status(404).json({ message: "Unauthorized to sell product" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);

    const new_product = await Product.create({
      description,
      category,
      cost,
      isAvailable,
      title,
      productPicture: result.secure_url,
    });

    return res.status(201).json(new_product);
  } catch (error)  {
    next(error);
  }
};

exports.findProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const find_product = await Product.findById({ _id: id });
    const product_find = {
      message: "Product Found",
      find_product,
    };
    return res.status(200).json(product_find);
  } catch (error) {
    next(error);
  }
};

exports.findlatestproduct = async (req, res
  ) => {
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
      const latest = await Product.find().sort(
        {  _id: -1 }).limit(limit)
  
      res.send({
        page,
        size,
        Info: latest,
      });
    }
    catch (error) {
      res.sendStatus(500);
    }
    
  };

exports.findProducts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const all_products = await Product.find()
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit * 1);

    return res
      .status(200)
      .json({ count: all_products.length, data: all_products });
  } catch (error) {
    next(error);
  }
};

exports.similarField = async (req, res, next) => {
  try {
    const category = req.params.category;
    const { page, limit } = req.query;
    const similar_field = await Product.find({ category: category })
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

exports.updateProduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    const { description, category, cost, productPicture, isAvailable, title } =
      req.body;
    const new_product = await Product.findByIdAndUpdate(
      { _id: id },
      { ...req.body },
      {
        new: true,
      }
    );
    const product_update = {
      message: "Updated successfully",
      new_product,
    };
    return res.status(200).json(product_update);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const id = req.params.id;
  try {
    const delete_product = await Product.findByIdAndDelete({ _id: id });
    const product_delete = {
      message: "Product Deleted",
      delete_product,
    };
    return res.status(200).json(product_delete);
  } catch (error) {
    next(error);
  }
};


exports.getTopProducts = async (req, res, next) => {
  try {
    // using aggregate function to get top 5 products
      const products = await Product.aggregate([
          {
              $sort: {
                isAvailable: 1,
              },
          },
          {
              $limit: 5,
          },
      ]);
      return res.status(200).json({
          message: "Top 5 products",
          products,
      });

  } catch (error) {
      next(error);
  }
};