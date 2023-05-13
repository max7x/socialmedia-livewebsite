import styled from "styled-components";
import { connect } from "react-redux";
import PostModal from "./PostModal";
import React, { useState } from "react";
import Search from "./Search";
import {
  TextField,
  Box,
  Button,
  List,
  ListItem,
  Typography,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {
  apiGetQueryArticles,
  apiPostComment,
  apiPutArticleText,
  apiPutCommentText,
} from "../../apis/api";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import Pagination from "@mui/material/Pagination";
import usePagination from "./Pagination";

const Container = styled.div`
  grid-area: Main;
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
`;

const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 8px;
  background: white;
  div {
    button {
      outline: none;
      color: rgb(0, 0, 0, 0.6);
      font-size: 14px;
      line-height: 1.5;
      min-height: 48px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    &:first-child {
      display: flex;
      align-items: center;
      padding: 8px 16px 0px 16px;
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 8px;
        object-fit: cover;
      }
      button {
        margin: 4px 0;
        flex-grow: 1;
        border-radius: 35px;
        padding-left: 16px;
        border: 1px solid rgb(0, 0, 0, 0.15);
        border-radius: 35px;
        background-color: white;
        text-align: left;
        :hover {
          background-color: rgba(0, 0, 0, 0.08);
          cursor: pointer;
        }
      }
    }
    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
      button {
        img {
          margin: 0 4px 0 -2px;
          width: 30px;
          height: 30px;
        }
        /* cursor: pointer; */
      }
    }
  }
`;

const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;
  span {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;

    img {
      vertical-align: middle;
      width: 48px;
      height: 48px;
      object-fit: cover;
    }
    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;
      span {
        text-align: left;
        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }

        &:nth-child(n + 1) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }

  button {
    position: absolute;
    right: 12px;
    top: 12px;
    background: transparent;
    border: none;
    outline: none;
    padding: 0 0 0 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    &:hover {
      cursor: pointer;
      background: #f6f6f6;
    }
    img {
      width: 26px;
      height: 26px;
    }
  }
`;

const CommentEdit = styled.div`
  button {
    position: absolute;
    right: 12px;
    top: 29px;
    background: transparent;
    border: none;
    outline: none;
    padding: 0 0 0 0;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    &:hover {
      cursor: pointer;
      background: #f6f6f6;
    }
    img {
      width: 26px;
      height: 26px;
    }
  }
`;

const Description = styled.div`
  padding: 8px 16px 8px 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 22px;
  text-align: left;
  border: ${(props) => (props.contentEditable ? "1px solid gray" : "none")};
  :focus {
    outline: ${(props) => (props.contentEditable ? "1px solid blue" : "none")};
  }
  border-radius: 4px;
`;

const CommentText = styled.p`
  overflow: hidden;
  margin-right: 38px;
  font-size: 18px;
  text-align: left;
  padding: 2px 0px 4px 0px;
  color: #717171;
  border: ${(props) => (props.contentEditable ? "1px solid gray" : "none")};
  :focus {
    outline: ${(props) => (props.contentEditable ? "1px solid blue" : "none")};
  }
  border-radius: 4px;
`;

const SharedImg = styled.div`
  margin-top: 8px;
  width: 100%;
  display: block;
  position: relative;
  background-color: #f9fafb;
  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
    max-height: fit-content;
    cursor: default;
  }
`;

const SocialCounts = styled.ul`
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;
  list-style: none;
  li {
    margin-right: 5px;
    font-size: 12px;
    button {
      display: flex;
      outline: none;
      border: none;
      background: transparent;
    }
  }
`;

const SocialActions = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-around;
  margin: 0;
  min-height: 40px;
  padding: 4px 8px;
  button {
    border: none;
    display: inline-flex;
    align-items: center;
    padding: 8px;
    color: #0a66c2;
    border-radius: 4px;
    background-color: white;
    :hover {
      background-color: rgba(0, 0, 0, 0.08);
      cursor: pointer;
    }
    @media (min-width: 768px) {
      span {
        margin-left: 8px;
      }
    }
  }
`;

const SearchBox = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 12px 12px;
  margin-bottom: 12px;
  align-items: center;
  display: flex;
`;

const CommentList = ({
  comments,
  user,
  handleCommentChange,
  handleSendClick,
  postId,
  commentText,
  editCommentText,
}) => {
  const tmp1 = {};
  const tmp2 = {};
  comments.forEach((comment) => {
    tmp1[comment.commentId] = false;
    tmp2[comment.commentId] = comment.text;
  });
  const [editingMap, setEditingMap] = useState(tmp1);
  const [textMap, setTextMap] = useState(tmp2);
  const handleEditClick = (commentId) => {
    if (editingMap[commentId]) {
      editCommentText(postId, commentId, textMap[commentId]);
    }
    const tmp = { ...editingMap };
    tmp[commentId] = !editingMap[commentId];
    setEditingMap(tmp);
  };

  return (
    <Box sx={{ padding: "4px 8px" }}>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {comments &&
          [...comments]
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(
              (
                { commentId, userId, userName, timestamp, text, photoURL },
                idx
              ) => (
                <ListItem key={idx} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={userName} src={photoURL} />
                  </ListItemAvatar>
                  <ListItemText
                    disableTypography
                    primary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline", mr: "4px" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {userName}
                        </Typography>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {new Date(timestamp).toLocaleString()}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <CommentText
                          contentEditable={editingMap[commentId]}
                          suppressContentEditableWarning
                          onInput={(e) => {
                            const tmp = { ...textMap };
                            tmp[commentId] = e.currentTarget.textContent;
                            setTextMap(tmp);
                          }}
                        >
                          {text}
                        </CommentText>
                        {user.userId === userId ? (
                          <CommentEdit>
                            <button onClick={() => handleEditClick(commentId)}>
                              {editingMap[commentId] ? (
                                <DoneOutlineIcon />
                              ) : (
                                <img
                                  src="/images/edit-icon.svg"
                                  alt="editable"
                                />
                              )}
                            </button>
                          </CommentEdit>
                        ) : (
                          <></>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              )
            )}
      </List>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          padding: "4px 8px 8px 8px",
          mr: "2px",
        }}
      >
        <Avatar
          alt={user.userName}
          src={user.photoURL}
          sx={{ color: "action.active", mr: 2, my: 0.5 }}
        />
        <TextField
          fullWidth
          placeholder="Share your thoughts!"
          variant="standard"
          value={commentText[postId] || ""}
          onChange={(e) => handleCommentChange(e, postId)}
          sx={{ padding: "0 10px 0 0" }}
        />
        <Button
          sx={{ borderRadius: 8 }}
          variant="contained"
          onClick={() => {
            handleSendClick(postId);
          }}
          startIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

const Post = ({
  postInfo,
  user,
  handleCommentChange,
  handleSendClick,
  commentText,
  editPostText,
  editCommentText,
}) => {
  const [commentShow, setCommentShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(postInfo.description);
  const dateObject = new Date(postInfo.timestamp);
  const clickComment = () => {
    setCommentShow(!commentShow);
  };
  const clickEdit = () => {
    if (editing && editText !== postInfo.description) {
      editPostText(postInfo.postId, editText);
    }
    setEditing(!editing);
  };
  return (
    <Article>
      <SharedActor>
        <span>
          <img src={postInfo.authorAvatar} alt="actor's avatar" />
          <div>
            <span>{postInfo.userName}</span>
            <span>{postInfo.authorEmail}</span>
            <span>{dateObject.toLocaleString()}</span>
          </div>
        </span>
        {user.userId === postInfo.userId ? (
          <button onClick={clickEdit}>
            {!editing ? (
              <img src="/images/edit-icon.svg" alt="editable" />
            ) : (
              <DoneOutlineIcon />
            )}
          </button>
        ) : (
          <></>
        )}
      </SharedActor>
      <Description
        contentEditable={editing}
        suppressContentEditableWarning={true}
        onInput={(e) => setEditText(e.currentTarget.textContent)}
      >
        {postInfo.description}
      </Description>
      <SharedImg>
        {postInfo.image && <img src={postInfo.image} alt="" />}
      </SharedImg>
      <SocialCounts>
        <li>
          <button>
            <img src="/images/likes.svg" alt="likes" />
            <span>42</span>
          </button>
        </li>
      </SocialCounts>
      <SocialActions>
        <button>
          <img src="/images/like-icon.svg" alt="" />
          <span>Like</span>
        </button>
        <button onClick={clickComment}>
          <img src="/images/comment-icon.svg" alt="" />
          <span>Comment</span>
        </button>
      </SocialActions>
      {commentShow && (
        <CommentList
          postId={postInfo.postId}
          user={user}
          comments={postInfo.comments}
          handleCommentChange={handleCommentChange}
          handleSendClick={handleSendClick}
          editCommentText={editCommentText}
          commentText={commentText}
        />
      )}
    </Article>
  );
};

const Main = (props) => {
  const [showModal, setShowModal] = useState("close");
  const [query, setQuery] = useState("");
  const [comment, setComment] = useState({});
  const handleClick = (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }
    switch (showModal) {
      case "open":
        setShowModal("close");
        break;
      case "close":
        setShowModal("open");
        break;
      default:
        setShowModal("close");
        break;
    }
  };
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };
  const handleSearchClick = () => {
    props.filterPosts(query);
  };
  const handleCommentChange = (e, postId) => {
    const newComment = { ...comment };
    newComment[postId] = e.target.value;
    setComment(newComment);
  };
  const handleSendClick = (postId) => {
    if (comment[postId]) {
      props.addComment(postId, comment[postId]);
      setComment("");
    }
  };

  const data = props.user.posts;
  let [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const count = Math.ceil(data.length / PER_PAGE);
  const _DATA = usePagination(data, PER_PAGE);
  const handlePageChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <Container>
      <ShareBox>
        <div>
          <img src={props.user.photoURL} alt="" />
          <button onClick={handleClick}>Start a post</button>
        </div>
        <div>
          <button>
            <img src="/images/photo-icon.png" alt="" />
            <span>Photo</span>
          </button>
          <button>
            <img src="/images/article-icon.png" alt="" />
            <span>Article</span>
          </button>
        </div>
      </ShareBox>
      <SearchBox>
        <Search
          value={query}
          onChange={handleSearchChange}
          onClick={handleSearchClick}
        />
      </SearchBox>
      <div>
        {!_DATA.empty() &&
          _DATA.currentData().map((post, idx) => {
            return (
              <Post
                key={idx}
                postInfo={post}
                user={{
                  userId: props.user.userId,
                  userName: props.user.userName,
                  photoURL: props.user.photoURL,
                }}
                handleCommentChange={handleCommentChange}
                handleSendClick={handleSendClick}
                commentText={comment}
                editPostText={props.editPostText}
                editCommentText={props.editCommentText}
              />
            );
          })}
        <Pagination
          count={count}
          size="large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handlePageChange}
        />
      </div>
      <PostModal showModal={showModal} handleClick={handleClick} />
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

const mapDispatchToProps = (dispatch) => ({
  filterPosts: (query) => apiGetQueryArticles(query, dispatch),
  addComment: (postId, text) => apiPostComment(text, postId, dispatch),
  editPostText: (postId, text) => apiPutArticleText({ postId, text }, dispatch),
  editCommentText: (postId, commentId, text) =>
    apiPutCommentText({ postId, commentId, text }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
