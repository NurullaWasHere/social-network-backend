const { urlencoded } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const checkAuth = require("./utils/checkAuth");
const multer = require("multer");
const InstModel = require('./models/Instagram');
const { register, logIn, getMe } = require("./controllers/UserController");
const cors = require('cors');
const {
  registerValidation,
  loginValidation,
  postValidation,
} = require("./validations/auth");
const {
  createPost,
  getAllPost,
  getOnePost,
  removePost,
  updatePost,
} = require("./controllers/PostController");

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.vtxdyc5.mongodb.net/blog1?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log(" DB Ok");
  })
  .catch((err) => {
    console.log("Error Occured", err);
  });

const app = express();
const PORT = 3002;

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "../../ictproject1/public/uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Home page");
});

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post("/auth/login", loginValidation, logIn);
app.get("/auth/me", checkAuth, getMe);
app.post("/auth/register", registerValidation, register);

app.get("/posts", checkAuth, getAllPost);
app.get("/posts/:id", checkAuth, getOnePost);
app.post("/posts", checkAuth, postValidation, createPost);
app.delete("/posts/:id", checkAuth, removePost);
app.patch("/posts", checkAuth, updatePost);
app.post("/inst", async (req, res) => {
  try {
    const doc = new InstModel({
      fullName: req.body.fullName,
      passwordHash: req.body.password,
    });
    const user = await doc.save();
    res.json(user._doc);
  } catch (error) {
    console.log(error);
    res.status(502);
  }
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("app started");
  // console.log(register);
  // console.log(logIn);
});
