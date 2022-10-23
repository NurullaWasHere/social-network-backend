const PostModel = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      imageUrl: req.body.imageUrl,
      text: req.body.text,
      viewsCount: req.bodyviewsCount,
      user: req.userId,
    });
    await doc.save();
    res.json(doc);
  } catch (error) {
    console.log("Post model Error", error);
    res.status(505);
  }
};

const getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log("Getting all post failed", error);
    res.status(505);
  }
};

const getOnePost = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findByIdAndUpdate(
      { _id: postId },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          return res.status(505).json({
            message: "Error occured with getting single post!",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Статья не найдена!",
          });
        }
        res.json(doc);
      }
    );
  } catch (error) {
    console.log("Error occured with getting single post!", error);
    res.status(505);
  }
};

const removePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.findByIdAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          return res.status(505).json({
            message: "Error occured",
            err,
          });
        }
        res.json(doc);
      }
    );
  } catch (err) {
    res.status(505).json({
      message: "Error occured",
      err,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        viewsCount: req.bodyviewsCount,
        user: req.userId,
      }
    );
    res.json( {
        succes: true
    })
  } catch (error) {
    res.status(505).json({
      message: "Error occured while updating",
    });
  }
};

module.exports = { createPost, getAllPost, getOnePost, removePost, updatePost };
