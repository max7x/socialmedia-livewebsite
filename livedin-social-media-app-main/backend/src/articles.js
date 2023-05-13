const _ = require("lodash");
const Article = require("./models/article.model");
const Profile = require("./models/profile.model");
const { v4: uuidv4 } = require("uuid");
const uploadImage = require("./uploadCloudinary");

async function getQueryArticles(req, res) {
  const keyword = req.query.keyword;
  const re = new RegExp(_.escapeRegExp(keyword), "i");
  const isMatchQuery = (postInfo) =>
    re.test(postInfo.userName) || re.test(postInfo.description);
  const profile = await Profile.findOne({ userId: req.userId });
  const feedUserIds = [...profile.following, req.userId];
  const articles = (
    await Article.find({
      userId: {
        $in: feedUserIds,
      },
    })
  ).filter(isMatchQuery);
  const uid2user = {};
  for (const article of articles) {
    if (!(article.userId in uid2user)) {
      uid2user[article.userId] = await Profile.findOne({
        userId: article.userId,
      });
    }
    for (const comment of article.comments) {
      if (!(comment.userId in uid2user)) {
        uid2user[comment.userId] = await Profile.findOne({
          userId: comment.userId,
        });
      }
    }
  }
  res.send({
    articles: articles.map((post) => ({
      postId: post.postId,
      userId: post.userId,
      userName: post.userName,
      authorEmail: uid2user[post.userId].email,
      authorAvatar: uid2user[post.userId].avatar,
      description: post.description,
      image: post.image,
      timestamp: post.created.getTime(),
      comments: post.comments.map((comment) => ({
        commentId: comment.commentId,
        userId: comment.userId,
        userName: comment.userName,
        text: comment.text,
        timestamp: comment.created.getTime(),
        photoURL: uid2user[comment.userId].avatar,
      })),
    })),
  });
}

async function putArticle(req, res) {
  const postId = req.params.id;
  const text = req.body.text;
  const commentId = req.body.commentId;
  let post = await Article.findOne({ postId: postId });
  if (!commentId) {
    await post.set({ description: text }).save();
  } else {
    await Article.updateOne(
      { postId: postId, "comments.commentId": commentId },
      {
        $set: {
          "comments.$.text": text,
        },
      }
    );
  }
  res.send({
    result: "success",
  });
}

async function postArticle(req, res) {
  const postId = uuidv4();
  const created = Date.now();
  const newArticle = new Article({
    postId: postId,
    userId: req.userId,
    userName: req.userName,
    description: req.body.text,
    created: created,
    image: req.fileurl || "",
    comments: [],
  });

  await newArticle.save();
  const profile = await Profile.findOne({ userId: req.userId });
  res.send({
    postId: postId,
    result: "success",
    article: {
      postId: postId,
      userId: req.userId,
      userName: req.userName,
      authorEmail: profile.email,
      authorAvatar: profile.avatar,
      description: req.body.text,
      image: req.fileurl,
      timestamp: created,
      comments: [],
    },
  });
}

async function postComment(req, res) {
  const postId = req.body.postId;
  const text = req.body.text;
  const post = await Article.findOne({ postId: postId });
  const commentId = uuidv4();
  const created = Date.now();
  const comment = {
    commentId: commentId,
    userName: req.userName,
    userId: req.userId,
    text: text,
    created: created,
  };
  post.comments.push(comment);
  await post.save();
  res.send({
    postId: postId,
    commentId: commentId,
    result: "success",
    comment: {
      commentId: comment.commentId,
      userName: comment.userName,
      userId: comment.userId,
      text: comment.text,
      photoURL: (await Profile.findOne({ userId: comment.userId })).avatar,
      timestamp: created,
    },
  });
}

async function getCommentsByPostId(req, res) {
  const postId = req.params.postId;
  const post = await Article.findOne({ postId: postId });
  const uid2avatar = {};
  for (const comment of post.comments) {
    if (!(comment.userId in uid2avatar)) {
      uid2avatar[comment.userId] = (
        await Profile.findOne({
          userId: comment.userId,
        })
      ).avatar;
    }
  }
  res.send({
    postId: postId,
    comments: _.map(post.comments, (comment) => ({
      commentId: comment.commentId,
      userId: comment.userId,
      userName: comment.userName,
      text: comment.text,
      timestamp: comment.created.getTime(),
      photoURL: uid2avatar[comment.userId],
    })),
  });
}

async function getArticlesByUserIds(req, res) {
  const userIds = req.body.userIds;
  const articles = await Article.find({
    userId: {
      $in: userIds,
    },
  });
  const uid2user = {};
  for (const article of articles) {
    if (!(article.userId in uid2user)) {
      uid2user[article.userId] = await Profile.findOne({
        userId: article.userId,
      });
    }
    for (const comment of article.comments) {
      if (!(comment.userId in uid2user)) {
        uid2user[comment.userId] = await Profile.findOne({
          userId: comment.userId,
        });
      }
    }
  }
  res.send({
    articles: articles.map((post) => ({
      postId: post.postId,
      userId: post.userId,
      userName: post.userName,
      authorEmail: uid2user[post.userId].email,
      authorAvatar: uid2user[post.userId].avatar,
      description: post.description,
      image: post.image,
      timestamp: post.created.getTime(),
      comments: post.comments.map((comment) => ({
        commentId: comment.commentId,
        userId: comment.userId,
        userName: comment.userName,
        text: comment.text,
        timestamp: comment.created.getTime(),
        photoURL: uid2user[comment.userId].avatar,
      })),
    })),
  });
}

module.exports = (app) => {
  app.get("/articles", getQueryArticles);
  app.put("/article/:id", putArticle);
  app.post("/article", uploadImage("article"), postArticle);
  app.post("/article/comment", postComment);
  app.get("/article/comments/:postId?", getCommentsByPostId);
  app.post("/articles/userIds", getArticlesByUserIds);
};
