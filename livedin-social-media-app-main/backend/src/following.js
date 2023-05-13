const _ = require("lodash");
const Profile = require("./models/profile.model");
const { fillFollowing } = require("./utils");

async function putFollowing(req, res) {
  let followerName = req.body.followerName;
  const userId = req.userId;
  const profile = await Profile.findOne({ userId: userId });
  follower = await Profile.findOne({ userName: followerName });
  const existed = !!follower;
  let result = "success";
  if (!profile) {
    return res.sendStatus(400);
  }
  if (existed) {
    const followerId = follower.userId;
    if (!profile.following.includes(followerId)) {
      profile.following.push(followerId);
      await profile.save();
    } else {
      result = "duplicate";
    }
  } else {
    result = "notfound";
  }
  const following = await fillFollowing(profile.following);
  res.send({
    userId: userId,
    following: following,
    result: result,
  });
}

async function deleteFollowing(req, res) {
  let followerId = req.body.followerId;
  const userId = req.userId;
  await Profile.updateOne(
    { userId: userId },
    {
      $pullAll: {
        following: [followerId],
      },
    }
  );
  const profile = await Profile.findOne({ userId: userId });
  const following = await fillFollowing(profile.following);
  res.send({ userId: userId, following: following });
}

module.exports = (app) => {
  app.put("/following", putFollowing);
  app.delete("/following", deleteFollowing);
};
