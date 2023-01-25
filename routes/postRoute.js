const router = require("express").Router();
const Post = require("../model/Post");
const { multerUploadS3 } = require("../utils/multer");

router.post("/", multerUploadS3.any(), (req, res) => {
  const { user, description } = req.body;
  let pic = null;
  if (req.files.length > 0) {
    pic = req.files[0].location;
  }
  const newPost = new Post({
    user,
    description,
    pic,
  });

  newPost
    .save()
    .then((doc) => {
      doc
        .populate("user")
        .then((doc) => {
          console.log(doc);
          res.send(doc);
        })
        .catch((e) => {
          console.log(e);
          res.status(400).json(e.message);
        });
    })
    .catch((e) => {
      console.log(e);
      res.status(400).json(e.message);
    });
});

router.get("/", (req, res) => {
  const start = 0;

  Post.find()
    .sort({ createdAt: "desc" })
    .populate("user")
    .skip(start)
    .limit(30)
    .then((items) => res.json(items))
    .catch((e) => {
      console.log(e);
      res.status(400).json(e.message);
    });
});

router.delete("/:id", (req, res) => {
  console.log(req.params);
  Post.findByIdAndDelete({ _id: req.params.id })
    .then((doc) => console.log(doc))
    .catch((e) => {
      console.log(e);
      res.status(400).json(e.message);
    });
});

router.get("/getPosts/:id", (req, res) => {
  Post.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .populate("user")
    .then((items) => res.json(items))
    .catch((e) => {
      console.log(e);
      res.status(400).json(e.message);
    });
});

module.exports = router;
