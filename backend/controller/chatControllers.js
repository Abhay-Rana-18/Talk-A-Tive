const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/UserModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userID } = req.body;

  if (!userID) {
    console.log("userID param is not sent with with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userID } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userID],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res
      .status(400)
      .send("Please fill all the details for creating a group");
  }

    var users = JSON.parse(req.body.users);
  // var users = req.body.users;

  if (users.length < 1) {
    return res
      .status(400)
      .send("More than 2 users are required to create a group.");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user,
      dp: req.body.dp,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const group = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!group) {
      res.status(400).send("No group found!");
    } else {
      return res.json(group);
    }
  } catch (error) {
    res.status(400).send("Internal server error!");
  }
});

const updateImageGroup = asyncHandler(async (req, res) => {
  try {
    const { chatId, dp } = req.body;
    const group = await Chat.findByIdAndUpdate(
      chatId,
      {
        dp,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!group) {
      res.status(400).send("No group found!");
    } else {
      return res.json(group);
    }
  } catch (error) {
    res.status(400).send("Internal server error!");
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  try {
    const { chatID, userID } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatID,
      { $push: { users: userID } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!added) {
      res.status(400).send("No group found!");
    } else {
      return res.json(added);
    }
  } catch (error) {
    res.status(400).send("Internal server error!");
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  try {
    const { chatID, userID } = req.body;
    const removed = await Chat.findByIdAndUpdate(
      chatID,
      {
        $pull: { users: userID },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      res.status(400).send("No group found!");
    } else {
      return res.json(removed);
    }
  } catch (error) {
    res.status(400).send("Internal server error!");
  }
});

// No. of unread messages
const changeCount = asyncHandler(async (req, res) => {
  try {
    const { chatId, count } = req.body;
    const group = await Chat.findByIdAndUpdate(
      chatId,
      {
        count,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!group) {
      res.status(400).send("No group found!");
    } else {
      return res.json(group);
    }
  } catch (error) {
    res.status(400).send("Internal server error!");
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  updateImageGroup,
  changeCount,
};
