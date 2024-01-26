const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, updateImageGroup, changeCount, findChat } = require('../controller/chatControllers');
const router = express.Router();


router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/count").put(protect, changeCount);
router.route("/dp").put(protect, updateImageGroup);
router.route("/addGroup").put(protect, addToGroup);
router.route("/removeGroup").put(protect, removeFromGroup);
router.route("/findChat").get(findChat);

module.exports = router;
