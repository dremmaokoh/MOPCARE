const router = require("express").Router();
const upload = require("../utils/multer");
const {
  addCourse,
  findSingleCourse,
  findCourses,
  similarField,
} = require("../controller/controller.course");
const { isAuth, validateRole } = require("../middleware/isAuth");

router.post(
  "/course",
  isAuth,
  validateRole,
  addCourse
);
router.get("/findcourse/:id", findSingleCourse);
router.get("/findallcourses", findCourses);
router.get("/find/:category", similarField);

module.exports = router;
