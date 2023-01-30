const router = require("express").Router();
const upload = require("../utils/multer");
const {
  addProduct,
  findProducts,
  similarField,
  findProduct,
  updateProduct,
  deleteProduct,
  findlatestproduct,
  getTopProducts
} = require("../controller/controller.product");
const { isAuth, validateRole } = require("../middleware/isAuth");

router.post(
  "/newProduct",
  isAuth,
  validateRole,
  upload.single("productPicture"),
  addProduct
);
router.get("/findproduct/:id", findProduct);
router.get("/findall", findProducts);
router.get("/findtoproduct", getTopProducts);
router.get("/find/:category",  similarField);
router.get("/findnew",  findlatestproduct);
router.put("/update/:id", isAuth, validateRole, updateProduct);
router.delete("/delete/:id", isAuth, validateRole, deleteProduct);

module.exports = router;
