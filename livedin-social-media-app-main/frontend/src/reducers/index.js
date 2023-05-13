import {
  SET_HEADLINE,
  SET_STATUS,
  SET_PROFILE,
  ADD_NEW_POST,
  SET_POSTS,
  SET_FOLLOWING,
  SET_AVATAR,
  ADD_COMMENT,
  SET_POST_TEXT,
  SET_COMMENT_TEXT,
} from "../actions/actionType";

import _ from "lodash";

export const NOT_LOG_IN = 0;
export const LOGGED_IN = 1;
export const NOT_FOUND = 2;
export const LINK_ACCOUNT = 3;
export const INITIAL_STATE = {
  // user info
  userId: "",
  userName: "unknown",
  email: "",
  photoURL: "/images/user.svg",
  phone: "",
  zipcode: "",
  headline: "",
  dob: 0,
  status: NOT_LOG_IN, // 0 not log in, 1 log in, 2 not found
  posts: [], // post in postList
  following: [],
};

// post = {
//   postId: post.id,
//   userId: post.userId,
//   description: post.body,
//   image: "/assets/shared-img.jpg",
//   timestamp:,
//   comments: [],
// };

// comment = {
//   userId, userName, timestamp, text, photoURL
// }

const rootReducer = (state = INITIAL_STATE, action) => {
  let new_posts, p;
  switch (action.type) {
    case SET_PROFILE:
      return { ...state, ...action.profile };
    case SET_POSTS:
      return { ...state, posts: action.posts };
    case SET_STATUS:
      return {
        ...state,
        status: action.status,
      };
    case SET_HEADLINE:
      return {
        ...state,
        headline: action.headline,
      };
    case SET_FOLLOWING:
      return {
        ...state,
        following: action.following,
      };
    case SET_AVATAR:
      return {
        ...state,
        photoURL: action.avatar,
      };
    // post
    case ADD_NEW_POST:
      new_posts = [{ ...action.newPost }, ...state.posts];
      return {
        ...state,
        posts: new_posts,
      };
    case ADD_COMMENT:
      let new_comment = action.comment;
      p = { ..._.find(state.posts, { postId: action.postId }) };
      p.comments = [...p.comments, new_comment];
      new_posts = _.filter(
        state.posts,
        ({ postId }) => postId !== action.postId
      );
      new_posts.push(p);
      return {
        ...state,
        posts: new_posts,
      };
    case SET_POST_TEXT:
      let text = action.text;
      p = { ..._.find(state.posts, { postId: action.postId }) };
      p.description = text;
      new_posts = _.filter(
        state.posts,
        ({ postId }) => postId !== action.postId
      );
      new_posts.push(p);
      return {
        ...state,
        posts: new_posts,
      };
    case SET_COMMENT_TEXT:
      p = { ..._.find(state.posts, { postId: action.postId }) };
      const comment = {..._.find(p.comments, { commentId: action.commentId })};
      comment.text = action.text;
      p.comments = _.filter(
        p.comments,
        ({ commentId }) => commentId !== action.commentId
      );
      p.comments.push(comment);
      new_posts = _.filter(
        state.posts,
        ({ postId }) => postId !== action.postId
      );
      new_posts.push(p);
      return {
        ...state,
        posts: new_posts,
      };
    default:
      return state;
  }
};

export default rootReducer;
