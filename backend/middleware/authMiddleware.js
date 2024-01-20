const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decodes token id
      const decorded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decorded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      //   throw new Error("Unauthorised user, token failed");
      res.send("Not authorised, token failed!");
    }
  }
  if (!token) {
    res.status(401);
    // throw new Error("Unauthorised user, token failed");
    res.send("Not authorised, token failed!");
  }
};

module.exports = { protect };
