import React, { useState } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { TextField, Button, Grid } from "@mui/material";
import { apiPutHeadline } from "../../apis/api";

const Container = styled.div`
  grid-area: LeftSide;
`;

const ArtCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
  transition: box-shadow 83ms;
  position: relative;
  border: none;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const UserInfo = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  padding: 12px 12px 16px;
  word-wrap: break-word;
  word-break: break-word;
`;

const CardBackground = styled.div`
  background: url("/images/card-bg.svg");
  background-position: center;
  background-size: 462px;
  height: 54px;
  margin: -12px -12px 0;
`;

const Photo = styled.div`
  box-shadow: none;
  background-image: url(${(props) => props.photoURL});
  width: 72px;
  height: 72px;
  box-sizing: border-box;
  background-clip: content-box;
  background-color: white;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
  border: 2px solid white;
  margin: -38px auto 12px;
  border-radius: 50%;
`;

const Link = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.9);
  font-weight: 600;
`;

const HeadlineText = styled.div`
  color: #0a66c2;
  margin-top: 4px;
  font-size: 16px;
  line-height: 1.33;
  font-weight: 400;
`;

const LeftSide = (props) => {
  const [headline, setHeadline] = useState("");

  const handleClick = (e) => {
    props.updateHeadline(headline);
    setHeadline("");
  };
  const handleHeadlineChange = (e) => {
    setHeadline(e.target.value);
  };
  return (
    <Container>
      <ArtCard>
        <UserInfo>
          <CardBackground />
          <a>
            <Photo photoURL={props.user.photoURL} />
            <Link>Welcome, {props.user.userName}!</Link>
          </a>
          <HeadlineText>{props.user.headline}</HeadlineText>
          <Grid container spacing={0.5}>
            <Grid item xs={8}>
              <TextField
                id="headline"
                // label="Status"
                variant="standard"
                placeholder="Status"
                value={headline}
                onChange={handleHeadlineChange}
              />
            </Grid>
            <Grid item xs={4}>
              <Button variant="text" size="medium" onClick={handleClick}>
                Update
              </Button>
            </Grid>
          </Grid>
        </UserInfo>
      </ArtCard>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateHeadline: (headline) => apiPutHeadline(headline, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeftSide);
