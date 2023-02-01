const router = require("express").Router();
const upload = require("../utils/multer");
const {
  signUp,
  loginUser,
  verifyEmail,
  findAllUsers,
  finduser,
  logOut,
  switchRole
} = require("../controller/controller.user");
const { isAuth, validateVerified, validateRole  } = require("../middleware/isAuth");

router.post("/register",  upload.single("profilePicture"), signUp);
router.post("/login", validateVerified, loginUser);
router.get("/verify-email", verifyEmail);
router.get("/findusers", validateRole, findAllUsers);
router.get("/finduser/:id", validateRole, finduser);
router.get("/logout", isAuth, logOut);


module.exports = router;
