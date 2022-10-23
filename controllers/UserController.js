const UserModel = require("../models/User");
const { validationResult, body } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: "Проблема с валидацей"
      });
    }

    // const token = jwt.sign(
    //   {
    //     email: req.body.email,
    //     fullName: "Nurulla",
    //   },
    //   "secret123",
    //   {expiresIn: "30d"}
    // );

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hash,
    });
    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(502);
  }
};

const logIn = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользватель не найден!",
      });
    }
    const validUser = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!validUser) {
      return res.status(403).json({
        message: "Пароль неверный",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      { expiresIn: "30d" }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token, isLogged: true });
  } catch (err) {
    res.send(err);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "Error occured: Пользватель не найден!",
      });
    }
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, isLogged: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { register, logIn, getMe };
