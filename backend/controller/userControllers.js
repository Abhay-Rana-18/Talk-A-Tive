const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const User = require("../models/UserModel");

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
    const {pic} = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        pic,
      },
      {new: true},
    )

    if (!user) {
      res.send("No user found!");
    }
    res.send(user);
  } catch (error) {
    res.send("Internal server error: "+error.message);
  }
});

module.exports = { registerUser, authUser, allUsers, changeProfile };
