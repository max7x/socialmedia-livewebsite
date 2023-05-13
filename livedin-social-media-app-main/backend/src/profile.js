const Profile = require("./models/profile.model");
const _ = require("lodash");
const { fillFollowing } = require("./utils");
const uploadImage = require("./uploadCloudinary");

async function putHeadline(req, res) {
  const headline = req.body.headline;
  await Profile.updateOne({ userId: req.userId }, { headline: headline });
  res.send({ userId: req.userId, headline: headline });
}

function postAvatar(req, res) {
  const userId = req.userId;
  const avatar = req.fileurl;
  Profile.updateOne({ userId: userId }, { avatar: avatar }).then(() => {
    res.send({ userId: userId, avatar: avatar });
  });
}

async function getProfile(req, res) {
  let userId = req.params.userId;
  if (!userId) {
    userId = req.userId;
  }
  const profile = await Profile.findOne({ userId: userId });
  if (!profile) {
    return res.sendStatus(404);
  }
  const following = await fillFollowing(profile.following);
  res.send({
    userId: userId,
    profile: {
      userId: profile.userId,
      userName: profile.userName,
      email: profile.email,
      photoURL: profile.avatar,
      phone: profile.phone,
      zipcode: profile.zipcode,
      headline: profile.headline,
      dob: profile.dob,
      isLinked: profile.isLinked,
      provider: profile.provider || "livedin",
      following: following,
    },
  });
}

async function putProfile(req, res) {
  const userId = req.userId;
  const fields = req.body.fields;
  await Profile.updateOne({ userId }, fields);
  res.send({ userId, result: "success", fields });
}

module.exports = (app) => {
  app.get("/profile/:userId?", getProfile);
  app.put("/headline", putHeadline);
  app.put("/profile", putProfile);
  app.post("/avatar", uploadImage("avatar"), postAvatar);
};
