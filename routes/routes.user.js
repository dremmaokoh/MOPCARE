const router = require("express").Router();
const upload = require("../utils/multer");
const {
  signUp,
  loginUser,
  verifyEmail,
  findAllUsers,
  finduser,
  logOut,
  updateUser,
  switchRole,
} = require("../controller/controller.user");
const {
  isAuth,
  validateVerified,
  validateRole,
} = require("../middleware/isAuth");

router.post("/register", upload.single("profilePicture"), signUp);
router.post("/login", validateVerified, loginUser);
router.get("/verifyemail", verifyEmail);
router.get("/findusers", isAuth, validateVerified, findAllUsers);
router.get("/finduser/:id", isAuth, validateVerified, finduser);
router.post("/switch",isAuth, validateVerified, switchRole);
router.put("/update/:id", isAuth,  updateUser);
router.get("/logout", isAuth, logOut);

module.exports = router;

