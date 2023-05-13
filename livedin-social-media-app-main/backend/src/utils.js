const Profile = require("./models/profile.model");

// utils
exports.fillFollowing = async (followingIds) => {
  const followerProfiles = await Profile.find({
    userId: {
      $in: followingIds,
    },
  });
  return followerProfiles.map((p) => ({
    userId: p.userId,
    userName: p.userName,
    headline: p.headline,
    photoURL: p.avatar,
  }));
};
