const router = require("express").Router();
const {
  signUp,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resetPasswordpage,
  switchtoSeller,
  findAllUsers,
  finduser,
  logOut,
} = require("../controller/controller.user");
const { isAuth, validateVerified } = require("../middleware/isAuth");

router.post("/register", signUp);
router.post("/login", validateVerified, loginUser);
router.get("/verify-email", verifyEmail);
router.get("/findusers", findAllUsers);
router.get("/finduser/:id", finduser);
router.post("/forgotpassword", validateVerified, forgotPassword);
router.get("/reset-password/:id/:token", resetPasswordpage);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/switch-seller", validateVerified, isAuth, switchtoSeller);
router.get("/logout", isAuth, logOut);

module.exports = router;
