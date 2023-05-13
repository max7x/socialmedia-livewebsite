import React, { useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { IconButton, TextField } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { apiAddFollower, apiRemoveFollower } from "../../apis/api";

const Container = styled.div`
  grid-area: RightSide;
`;
const FollowCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgba(0 0 0 / 20%);
  padding: 12px;
`;

const Title = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  color: rgba(0, 0, 0, 0.6);
`;

const AddFollowCard = styled.div`
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 8px;
  background: white;
  outline: none;
  position: relative;
  border: none;
  padding: 12px;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgba(0 0 0 / 20%);
`;

const FeedList = styled.ul`
  margin-top: 16px;
  li {
    display: flex;
    align-items: center;
    margin: 12px 0;
    position: relative;
    font-size: 14px;
    & > div {
      display: flex;
      flex-direction: column;
      text-align: left;
      & span:nth-child(2) {
        color: #0a66c2;
      }
    }
    button {
      position: absolute;
      right: 6px;
      top: 6px;
      &:hover {
        cursor: pointer;
      }
      img {
        width: 26px;
        height: 26px;
      }
    }
  }
`;

const Avatar = styled.div`
  background-image: url(${(props) => props.photoURL});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 48px;
  height: 48px;
  margin-right: 8px;
`;

const AddFollowTextField = (props) => {
  return (
    <TextField
      fullWidth
      error={props.followError}
      helperText={props.followHelperText}
      id="addFollow"
      onChange={props.onChange}
      value={props.value}
      label="Add existed username to follow"
      sx={{ width: "100%" }}
      InputProps={{
        endAdornment: (
          <IconButton onClick={props.onClick}>
            <AddIcon />
          </IconButton>
        ),
      }}
    />
  );
};

const RightSide = (props) => {
  const [followQuery, setFollowQuery] = useState("");
  const [followError, setFollowError] = useState(false);
  const [followHelperText, setFollowHelperText] = useState("");
  const handleFollowQueryChange = (e) => {
    setFollowQuery(e.target.value);
    setFollowHelperText("");
    setFollowError(false);
  };
  const handleFollowClick = async () => {
    if (followQuery === props.user.userName) {
      setFollowError(true);
      setFollowHelperText("you can't follow yourself");
      return;
    }
    const result = await props.addUserToFollow(followQuery);
    if (result === "notfound") {
      setFollowError(true);
      setFollowHelperText("username is not existed");
      return;
    }
    if (result === "duplicate") {
      setFollowError(true);
      setFollowHelperText("already following");
      return;
    }
    setFollowQuery("");
  };
  const handleUnfollowClick = (e) => {
    props.removeUserFollow(e.currentTarget.getAttribute("userid"));
  };
  return (
    <Container>
      <AddFollowCard>
        <AddFollowTextField
          value={followQuery}
          onClick={handleFollowClick}
          onChange={handleFollowQueryChange}
          followError={followError}
          followHelperText={followHelperText}
        />
      </AddFollowCard>
      <FollowCard>
        <Title>
          <h2>You are following</h2>
          <img src="/images/feed-icon.svg" alt="" />
        </Title>
        <FeedList>
          {props.user.following &&
            props.user.following.map((follow, key) => {
              return (
                <li key={key}>
                  <a>
                    <Avatar photoURL={follow.photoURL} />
                  </a>
                  <div>
                    <span>{follow.userName}</span>
                    <span>{follow.headline}</span>
                  </div>
                  <div>
                    <IconButton
                      onClick={handleUnfollowClick}
                      userid={follow.userId}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </div>
                </li>
              );
            })}
        </FeedList>
      </FollowCard>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state,
    posts: state.postList,
    userList: state.userList,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addUserToFollow: async (userName) => {
    return await apiAddFollower(userName, dispatch);
  },
  removeUserFollow: (id) => apiRemoveFollower(id, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RightSide);
