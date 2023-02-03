const router = require("express").Router();
const upload = require("../utils/multer");
const {
  addCourse,
  findSingleCourse,
  findCourses,
  similarField,
  updateCourse,
  deleteCourse

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
router.put("/courseupdate/:id", isAuth, validateRole, updateCourse);
router.delete("/delete/:id", isAuth, validateRole, deleteCourse);





module.exports = router;
