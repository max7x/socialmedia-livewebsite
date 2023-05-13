import { NOT_LOG_IN } from "../reducers";
import {
  SET_STATUS,
  SET_PROFILE,
  ADD_NEW_POST,
  SET_HEADLINE,
  SET_POSTS,
  SET_FOLLOWING,
  SET_AVATAR,
  ADD_COMMENT,
  SET_POST_TEXT,
  SET_COMMENT_TEXT,
} from "./actionType";

export const setStatus = (status) => ({
  type: SET_STATUS,
  status: status,
});

export function signOut() {
  return setStatus(NOT_LOG_IN);
}

export function updateHeadline(headline) {
  return { type: SET_HEADLINE, headline };
}

export function setFollowing(following) {
  return { type: SET_FOLLOWING, following };
}

export function addPost(newPost) {
  return { type: ADD_NEW_POST, newPost };
}

export function setProfile(profile) {
  return { type: SET_PROFILE, profile: profile };
}

export function setPosts(posts) {
  return { type: SET_POSTS, posts };
}

export function setAvatar(avatar) {
  return { type: SET_AVATAR, avatar };
}

export function addComment(postId, comment) {
  return { type: ADD_COMMENT, postId, comment };
}

export function setPostText(postId, text) {
  return { type: SET_POST_TEXT, postId, text };
}

export function setCommentText(postId, commentId, text) {
  return { type: SET_COMMENT_TEXT, postId, commentId, text };
}
