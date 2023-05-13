import {
  addComment,
  addPost,
  setAvatar,
  setCommentText,
  setFollowing,
  setPosts,
  setPostText,
  setProfile,
  setStatus,
  signOut,
  updateHeadline,
} from "../actions";
import { LOGGED_IN, NOT_FOUND, NOT_LOG_IN } from "../reducers";
import "isomorphic-fetch";
const queryString = require("query-string");
const config = require("../config.json");
export const url = (path) => `${config.backendUrl}${path}`;

// dispatch
export const apiSignIn = async (username, password, dispatch) => {
  try {
    let loginUser = { userName: username, password };
    let result = await fetch(url("/login"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginUser),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res.result;
      });
    if (result === "success") {
      dispatch(setStatus(LOGGED_IN));
    } else {
      dispatch(setStatus(NOT_FOUND));
    }
  } catch (error) {
    console.log(error);
  }
};

export const apiPostArticle = async (formData, dispatch) => {
  try {
    let response = await fetch(url("/article"), {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => res.json());
    if (response.result !== "success") {
      throw new Error(`Failed to post an article. response:${response}`);
    }
    const post = response.article;
    dispatch(addPost(post));
  } catch (error) {
    console.log(error);
  }
};

export const apiPostComment = async (text, postId, dispatch) => {
  try {
    let response = await fetch(url("/article/comment"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, postId }),
    }).then((res) => res.json());
    if (response.result !== "success") {
      throw new Error(`Failed to post a comment. response:${response}`);
    }
    dispatch(addComment(postId, response.comment));
  } catch (error) {
    console.log(error);
  }
};

export const apiGetQueryArticles = async (query, dispatch) => {
  try {
    const articles = await fetchArticles(query);
    dispatch(setPosts(articles));
  } catch (error) {
    console.log(error);
  }
};

export const apiAddFollower = async (followerName, dispatch) => {
  try {
    const { result, following } = await fetchAddFollower(followerName);
    if (result === "success") {
      dispatch(setFollowing(following));
      const articles = await fetchArticles("");
      dispatch(setPosts(articles));
    }
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const apiRemoveFollower = async (followerId, dispatch) => {
  try {
    const { following } = await fetchDeleteFollower(followerId);
    dispatch(setFollowing(following));
    const articles = await fetchArticles("");
    dispatch(setPosts(articles));
  } catch (error) {
    console.log(error);
  }
};

export const apiPutHeadline = async (headline, dispatch) => {
  try {
    const newHeadline = await fetchPutHeadline(headline);
    dispatch(updateHeadline(newHeadline));
  } catch (error) {
    console.log(error);
  }
};

export const apiRegister = async (userName, password, email) => {
  try {
    const res = await fetchRegister(userName, password, email);
    return res.result;
  } catch (error) {
    console.log(error);
  }
};

export const apiSignOut = (dispatch) => {
  fetchSignOut();
  dispatch(signOut());
};

export const apiPutProfile = async (fields, dispatch) => {
  const res = await fetchPutProfile(fields);
  dispatch(setProfile(fields));
  return res.result === "success";
};

export const apiChangePassword = async (password, dispatch) => {
  const result = await fetchChangePassword(password);
  return result === "success";
};

export const apiUpdateAvatar = async (formData, dispatch) => {
  const avatar = await fetchPostAvatar(formData);
  dispatch(setAvatar(avatar));
};

export const apiPutArticleText = async ({ postId, text }, dispatch) => {
  dispatch(setPostText(postId, text));
  fetchPutArticle({ postId, commentId: "", text });
};

export const apiPutCommentText = async (
  { postId, commentId, text },
  dispatch
) => {
  dispatch(setCommentText(postId, commentId, text));
  fetchPutArticle({ postId, commentId, text });
};

export const apiGetHomeData = async (dispatch) => {
  try {
    dispatch(setStatus(LOGGED_IN));
    const isLoggedIn = await fetchCheckLoginStatus();
    if (isLoggedIn) {
      const profile = await fetchGetProfile();
      dispatch(setProfile(profile));
      const posts = await fetchArticles();
      dispatch(setPosts(posts));
    } else {
      dispatch(setStatus(NOT_LOG_IN));
    }
  } catch (error) {
    console.log(error);
  }
};

export const apiLinkAccount = async (
  { userName, password, googleId },
  dispatch
) => {
  const res = await fetchLinkAccount({ userName, password, googleId });
  if (res.result === "success") {
    dispatch(setStatus(LOGGED_IN));
  } else {
    dispatch(setStatus(NOT_FOUND));
  }
};

export const apiUnlinkAccount = async ({ userId }, dispatch) => {
  const res = await fetchUnlinkAccount({ userId });
  if (res.result === "success") {
    const profile = await fetchGetProfile();
    dispatch(setProfile(profile));
    return true;
  }
  return false;
};

// pure fetch
const fetchCheckLoginStatus = async () => {
  try {
    return await fetch(url("/login/status"), {
      method: "GET",
      credentials: "include",
    }).then((res) => res.status === 200);
  } catch (error) {
    console.log(error);
  }
};

const fetchUnlinkAccount = async (payload) => {
  try {
    return await fetch(url("/account/unlink"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  } catch (error) {
    console.log(error);
  }
};

const fetchLinkAccount = async (payload) => {
  try {
    return await fetch(url("/account/link"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  } catch (error) {
    console.log(error);
  }
};

const fetchPutArticle = async ({ postId, commentId, text }) => {
  try {
    return await fetch(url(`/article/${postId}`), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId, text }),
    })
      .then((res) => res.json())
      .then((res) => res.result);
  } catch (error) {
    console.log(error);
  }
};

const fetchPostAvatar = async (formData) => {
  try {
    return await fetch(url("/avatar"), {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => res.avatar);
  } catch (error) {
    console.log(error);
  }
};

const fetchChangePassword = async (password) => {
  try {
    return await fetch(url("/password"), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then((res) => res.json())
      .then((res) => res.result);
  } catch (error) {
    console.log(error);
  }
};

const fetchPutProfile = async (fields) => {
  try {
    return await fetch(url("/profile"), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    }).then((res) => res.json());
  } catch (error) {
    console.log(error);
  }
};

const fetchSignOut = async () => {
  fetch(url("/logout"), {
    method: "PUT",
    credentials: "include",
  });
};

const fetchRegister = async (userName, password, email) => {
  try {
    return await fetch(url("/register"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password, email }),
    }).then((res) => res.json());
  } catch (error) {
    console.log(error);
  }
};

const fetchPutHeadline = async (headline) => {
  try {
    return await fetch(url("/headline"), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headline }),
    })
      .then((res) => res.json())
      .then((res) => res.headline);
  } catch (error) {
    console.log(error);
  }
};

const fetchDeleteFollower = async (followerId) => {
  try {
    return await fetch(url("/following"), {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerId }),
    })
      .then((res) => res.json())
      .then((res) => ({
        following: res.following,
      }));
  } catch (error) {
    console.log(error);
  }
};

export const fetchAddFollower = async (followerName) => {
  try {
    return await fetch(url("/following"), {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ followerName }),
    })
      .then((res) => res.json())
      .then((res) => ({
        result: res.result,
        following: res.following,
      }));
  } catch (error) {
    console.log(error);
  }
};

export const fetchArticles = async (query) => {
  try {
    return await fetch(
      queryString.stringifyUrl({
        url: url("/articles"),
        query: { keyword: query },
      }),
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((res) => res.articles);
  } catch (error) {
    console.log(error);
  }
};

export const fetchGetProfile = async () => {
  try {
    const profile = await fetch(url("/profile"), {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => res.profile);
    return profile;
  } catch (error) {
    console.log(error);
  }
};

export const fetchGetAvatarByUserId = async ({ userId }) => {
  try {
    const avatar = await fetch(url(`/avatar/${userId}`), {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((res) => res.avatar);
    return avatar;
  } catch (error) {
    console.log(error);
  }
};

export const fetchGetPostsByUserIds = async ({ userIds }) => {
  try {
    const posts = await fetch(url("/articles/userIds"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userIds: userIds }),
    })
      .then((res) => res.json())
      .then((res) => res.articles);
    return posts;
  } catch (error) {
    console.log(error);
  }
};
