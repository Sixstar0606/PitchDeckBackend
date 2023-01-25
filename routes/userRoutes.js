const router = require("express").Router();
const multer = require("multer");
const User = require("../model/User");
const Campaign = require("../model/Campaign");
const { multerUploadS3 } = require("../utils/multer");

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json({ user });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/", function (req, res) {
  User.find({}, function (err, users) {
    res.json(users);
  });
});

router.post("/", async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      userRole,
      lookingcrowdfund,
      companyName,
      goalAmount,
      pitchDeckURL,
      picture,
    } = req.body;
    //console.log(req.body);
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      userRole,
      lookingcrowdfund,
      companyName,
      goalAmount,
      pitchDeckURL,
      picture,
    });
    res.status(201).json(user);
  } catch (e) {
    let msg;
    if (e.code == 11000) {
      msg = "User already exists";
    } else {
      msg = e.message;
    }
    console.log(e);
    res.status(400).json(msg);
  }
});

//update bio
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    // https://stackoverflow.com/questions/30419575/mongoose-findbyidandupdate-not-returning-correct-model
    const result = await User.findByIdAndUpdate(id, updates, { new: true });
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

router.put("/invest/:id", async (req, res) => {
  try {
    const { id, investamount } = req.body;
    const user = await User.findById(id);
    user.investamount = investamount;

    const result = await User.findByIdAndUpdate(id, user, { new: true });
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

// login user

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    user.status = "online";
    await user.save();
    res.status(200).json(user);
  } catch (e) {
    res.status(400).json(e.message);
  }
});

//update picture
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/:id", upload.single("file"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const base64 = req.file.buffer.toString("base64");
    const updates = { picture: `data:${req.file.mimetype};base64,${base64}` };
    // console.log(updates);

    // https://stackoverflow.com/questions/30419575/mongoose-findbyidandupdate-not-returning-correct-model
    const result = await User.findByIdAndUpdate(id, updates, { new: true });
    res.send(result);
  } catch (error) {
    console.log("error in post update picture");
    console.log(error.message);
  }
});

router.post("/campaign/add", multerUploadS3.any(), async (req, res, next) => {
  try {
    if (req.files) {
      req.body.video = req.files[0].location;
      req.body.pic = req.files[1].location;
    }
    let data = req.body;
    data = { ...data, investorRewards: JSON.parse(data?.investorRewards) };
    const result = await Campaign.create(data);
    res.send(result);
  } catch (error) {
    console.log("error while adding campaign");
    console.log(error.message);
  }
});

router.patch("/campaign/:id", multerUploadS3.any(), async (req, res, next) => {
  try {
    if (req.files?.length > 0) {
      console.log("req.files", req.files);
      if (!req.body.video) {
        req.body.pic = req.files[0].location;
      } else if (!req.body.pic) {
        req.body.video = req.files[0].location;
      } else {
        req.body.video = req.files[0].location;
        req.body.pic = req.files[1].location;
      }
    }
    let data = req.body;
    data = { ...data, investorRewards: JSON.parse(data?.investorRewards) };
    const result = await Campaign.findByIdAndUpdate(req.params.id, data);
    res.send(result);
  } catch (error) {
    console.log("error while updaing campaign");
    console.log(error.message);
  }
});

router.get("/getCampaign/:id", async (req, res, next) => {
  try {
    const result = await Campaign.findOne({ user: req.params.id });
    res.send(result);
  } catch (error) {
    console.log("error while getting campaign");
    console.log(error.message);
  }
});

router.patch(
  "/updatedProfile/:id",
  multerUploadS3.any(),
  async (req, res, next) => {
    console.log("req.params.id", req.params.id);
    try {
      if (req.files?.length > 0) {
        req.body.picture = req.files[0].location;
      }
      let data = req.body;
      const result = await User.findByIdAndUpdate(req.params.id, data);
      res.send(result);
    } catch (error) {
      console.log("error while updaing user");
      console.log(error.message);
    }
  }
);

module.exports = router;
