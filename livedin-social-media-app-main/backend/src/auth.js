const bcrypt = require("bcrypt");
const md5 = require("md5");
const _ = require("lodash");
const User = require("./models/user.model");
const Profile = require("./models/profile.model");
const Article = require("./models/article.model");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const config = require("../config.json");

const saltRounds = 10;
let sessionUser = {};
const cookieKey = "sid";
const LIVEDIN = "livedin";

function isLoggedIn(req, res, next) {
  if (!req.cookies) {
    return res.sendStatus(401);
  }
  let sid = req.cookies[cookieKey];
  if (!sid) {
    return res.sendStatus(401);
  }
  let user = sessionUser[sid];
  if (user) {
    req.userName = user.userName;
    req.userId = user.userId;
    next();
  } else {
    return res.sendStatus(401);
  }
}

function generateCode(user) {
  return md5(user.userName + Date.now());
}

function logout(req, res) {
  let sid = req.cookies[cookieKey];
  sessionUser = _.omit(sessionUser, sid);
  res.clearCookie(cookieKey, { httpOnly: true });
  res.send("OK");
}

async function register(req, res) {
  const userName = req.body.userName;
  const password = req.body.password;
  const email = req.body.email;
  const avatar = req.body.avatar;
  if (!userName || !password) {
    return res.sendStatus(400);
  }
  const existed = !!(await User.exists({ "auth.livedin": userName }));
  if (existed) {
    res.send({ userName: userName, result: "duplicate" });
    return;
  }
  const uid = uuidv4();
  const hash = bcrypt.hashSync(password, saltRounds);
  new Profile({
    userId: uid,
    userName: userName,
    headline: "Happy Everyday!",
    email: email,
    created: Date.now(),
    following: [],
    avatar: avatar || "/images/user.svg",
    provider: LIVEDIN,
  }).save();
  new User({
    userId: uid,
    userName: userName,
    hash: hash,
    auth: { livedin: userName },
    provider: LIVEDIN,
    created: Date.now(),
  })
    .save()
    .then((data) => {
      res.send({ userName: data.userName, result: "success" });
    });
}

function changePassword(req, res) {
  let userId = req.userId;
  let newPassword = req.body.password;
  if (!userId || !newPassword) {
    return res.sendStatus(400);
  }
  const hash = bcrypt.hashSync(newPassword, saltRounds);
  User.updateOne({ userId: userId }, { hash: hash }).then(
    res.send({ userName: req.userName, userId: req.userId, result: "success" })
  );
}

function login(req, res) {
  let userName = req.body.userName;
  let password = req.body.password;
  console.log({ userName, password });
  if (!userName || !password) {
    return res.sendStatus(400);
  }
  User.findOne({ "auth.livedin": userName }).then((user) => {
    if (!user) {
      return res.send({ userName: userName, result: "failed" });
    }
    if (bcrypt.compareSync(password, user.hash)) {
      let sid = generateCode(user);
      sessionUser[sid] = user;
      res.cookie(cookieKey, sid, {
        maxAge: 3600 * 1000,
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      const msg = {
        userName: userName,
        userId: user.userId,
        result: "success",
      };
      res.send(msg);
    } else {
      res.send({ userName: userName, result: "failed" });
    }
  });
}

async function googleLogin(req, res) {
  let user = req.user;
  const uid = uuidv4();
  let u = await User.findOne({
    userName: user.userName,
    provider: user.provider,
  });
  if (!u) {
    u = new User({
      userId: uid,
      userName: user.userName,
      auth: { google: user.userName },
      provider: user.provider,
      created: Date.now(),
    });
    u.save();
  }
  let p = await Profile.findOne({ userId: u.userId });
  if (!p) {
    p = new Profile({
      userId: uid,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider,
      created: Date.now(),
    });
    p.save();
  }
  let sid = generateCode(u);
  sessionUser[sid] = u;
  res.cookie(cookieKey, sid, {
    maxAge: 3600 * 1000,
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.redirect(302, `${config.frontendUrl}/home`);
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: `${config.googleClientId}`,
      clientSecret: `${config.googleClientSecret}`,
      callbackURL: `${config.backendUrl}/auth/google/callback`,
    },
    function (accessToken, refreshToken, profile, done) {
      let user = {
        /*'email': profile.emails[0].value,
            'name' : profile.name.givenName + ' ' + profile.name.familyName,
            'id'   : profile.id,*/
        userId: profile.id,
        userName: profile._json.given_name,
        email: profile._json.email,
        avatar: profile._json.picture,
        provider: profile.provider,
        token: accessToken,
      };
      // You can perform any necessary actions with your user at this point,
      // e.g. internal verification against a users table,
      // creating new user entries, etc.
      // googleUserId = user.userId;

      return done(null, user);
      // User.findOrCreate(..., function(err, user) {
      //     if (err) { return done(err); }
      //     done(null, user);
      // });
    }
  )
);
// Redirect the user to Google for authentication.  When complete,
// Google will redirect the user back to the application at
//     /auth/google/callback
const googleAuth = passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login", "email"],
}); // could have a passport auth second arg {scope: 'email'}

// Google will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
const googleRedirect = passport.authenticate("google", {
  successRedirect: "/login/google",
  failureRedirect: `${config.frontendUrl}`,
});

const linkAccount = async (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const googleId = req.body.googleId;
  const user = await User.findOneAndDelete({
    "auth.livedin": userName,
  });
  if (!user) {
    return res.send({ result: "notfound" });
  }
  if (bcrypt.compareSync(password, user.hash)) {
    const googleUser = await User.findOneAndUpdate(
      { userId: googleId },
      {
        $set: {
          userName: user.userName,
          hash: user.hash,
          ["auth.livedin"]: user.userName,
        },
      }
    );
    await Article.updateMany({ userId: user.userId }, { userId: googleId });
    await Article.updateMany(
      { "comments.userId": user.userId },
      { $set: { "comments.$.userId": googleId } }
    );
    const profile = await Profile.findOneAndDelete({ userId: user.userId });
    const googleProfile = await Profile.findOneAndUpdate(
      { userId: googleId },
      {
        $addToSet: {
          following: profile.following,
        },
        $set: {
          userName: user.userName,
          isLinked: true,
        },
      }
    );
    return res.send({ result: "success" });
  } else {
    return res.send({ result: "notfound" });
  }
};

const unlinkAccount = async (req, res) => {
  const userId = req.body.userId;
  await User.updateOne(
    { userId: userId },
    {
      $set: {
        ["auth.google"]: "",
        provider: LIVEDIN,
      },
    }
  );
  await Profile.updateOne(
    {
      userId: userId,
    },
    {
      $set: {
        isLinked: false,
        provider: LIVEDIN,
      },
    }
  );
  res.send({ result: "success" });
};

module.exports = (app) => {
  app.use(
    session({
      secret: "doNotGuessTheSecret",
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.get("/auth/google", googleAuth);
  app.get("/auth/google/callback", googleRedirect);
  app.get("/login/google", googleLogin);
  app.post("/login", login);
  app.post("/register", register);
  app.use(isLoggedIn);
  app.get("/login/status", (req, res) => res.send(""));
  app.post("/account/link", linkAccount);
  app.post("/account/unlink", unlinkAccount);
  app.put("/logout", logout);
  app.put("/password", changePassword);
};
