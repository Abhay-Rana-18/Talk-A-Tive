const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/UserModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, time } = req.body;
  if (!content || !chatId) {
    res.status(400).send("Inappropriate data for sending the message");
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
    time: time,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await message.populate("time");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    message = await User.populate(message, {
      path: "chat.latestMessage",
      // select: "content",
    });

    message = await User.populate(message, {
      path: "chat.groupAdmin",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { sendMessage, allMessages };
