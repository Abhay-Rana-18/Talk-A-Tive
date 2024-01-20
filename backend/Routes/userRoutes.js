const express = require("express");
const router = express.Router();
const {registerUser, authUser, allUsers, changeProfile} = require("../controller/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.route("/profile").put(protect, changeProfile);


module.exports = router;
