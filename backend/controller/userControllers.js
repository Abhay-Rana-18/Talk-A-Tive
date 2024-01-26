const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/UserModel");
const Message = require("../models/messageModel");

const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    return res.send("Please enter all the fields");
    // throw new Error("Please enter all the fields");
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
      // throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).send("Failed to create the user");
      // throw new Error("Failed to create the user.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
};

// Authentication user
const authUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).send("Wrong Email or Password");
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// /api/user?serach=Abhay
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // const users = await User.find(keyword);
  res.json(users);
});

// change user picture
const changeProfile = asyncHandler(async (req, res) => {
  try {
    const { pic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        pic,
      },
      { new: true }
    );

    if (!user) {
      res.send("No user found!");
    }
    res.send(user);
  } catch (error) {
    res.send("Internal server error: " + error.message);
  }
});

const getNoti = asyncHandler(async (req, res) => {
  try {
    let user = await User.findById(req.user._id).populate("notification");
    user = await Message.populate(user, {
      path: "notification.sender",
    });

    user = await Message.populate(user, {
      path: "notification.chat",
    });

    user = await Message.populate(user, {
      path: "notification.chat.users",
      select: "-password",
    });
    if (user) {
      return res.json(user.notification);
    }
    return res.send("nothing");
  } catch (error) {
    res.status(400).send("Internal server error!");
  }
});

const addNoti = asyncHandler(async (req, res) => {
  try {
    const { msgId } = req.body;
    if (!msgId) {
      return res.status(400).send("Notification not found!");
    }
    const user = await User.findById(req.user._id);
    if (user.notification.includes(msgId)) {
      return res.send("This notification is already present!");
    }

    let added = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { notification: msgId } },
      { new: true }
    ).populate("notification");

    user = await user.save();

    added = await Message.populate(added, {
      path: "notification.sender",
    });

    added = await Message.populate(added, {
      path: "notification.chat",
    });

    if (!added) {
      return res.status(400).send("User not found!");
    }

    return res.json(added);
  } catch (error) {
    console.error(error); // Log the full error details
    res.status(500).send("Internal server error!");
  }
});

const removeNoti = asyncHandler(async (req, res) => {
  try {
    const { msgId } = req.body;
    const noti = await Message.findById(msgId);
    const added = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { notification: msgId } },
      { new: true }
    );

    if (!added) {
      res.status(400).send("No notificaiton found!");
    } else {
      return res.json(added);
    }
  } catch (error) {
    res.status(400).send("Internal server error!");
  }
});

const removeNotiByUser = asyncHandler(async (req, res) => {
  try {
    const { msgId } = req.body;

    // Find the message and populate the sender and chat fields
    const noti = await Message.findById(msgId).populate("sender chat");

    if (!noti) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    const { sender, chat } = noti;

    const senderId = sender.toString(); // Extract string ObjectId
    const chatId = chat.toString(); // Assuming similar issue with chat

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          notification: { $or: [{ sender: senderId }, { chat: chatId }] }
        }
      },
      { new: true }
    );

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error!");
  }
});


const removeAllNoti = asyncHandler(async (req, res) => {
  try {
    const added = await User.findByIdAndUpdate(
      req.user._id,
      { notification: [] },
      { new: true }
    );

    if (!added) {
      res.status(400).send("No notification found!");
    } else {
      console.log("Notifications cleared:", added);
      return res.json(added);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Internal server error!");
  }
});



module.exports = {
  registerUser,
  authUser,
  allUsers,
  changeProfile,
  addNoti,
  removeNoti,
  getNoti,
  removeNotiByUser,
  removeAllNoti
};
