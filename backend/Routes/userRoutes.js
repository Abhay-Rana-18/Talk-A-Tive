const express = require("express");
const router = express.Router();
const {registerUser, authUser, allUsers, changeProfile, addNoti, removeNoti, getNoti} = require("../controller/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.route("/profile").put(protect, changeProfile);
router.route("/notiAdd").put(protect, addNoti);
router.route("/notiremove").put(protect, removeNoti);
router.route("/notiGet").get(protect, getNoti);


module.exports = router;
