import React, { useState, useEffect } from "react";
import Header from "../home/Header";
import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {
  Box,
  Avatar,
  Container,
  Typography,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import CameraIcon from "@mui/icons-material/Camera";
import { connect } from "react-redux";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { Navigate, Link } from "react-router-dom";
import { LINK_ACCOUNT, LOGGED_IN } from "../../reducers";
import {
  apiChangePassword,
  apiPutProfile,
  apiUnlinkAccount,
  apiUpdateAvatar,
} from "../../apis/api";
import { setStatus } from "../../actions";

const OutContainer = styled.div`
  padding-top: 52px;
  max-width: 100%;
`;

const Profile = (props) => {
  const origin = {
    password: "",
    confirmPassword: "",
    email: "",
    zipcode: "",
    phone: "",
  };
  const [profile, setProfile] = useState(origin);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      return value === profile.password;
    });
    return () => {
      ValidatorForm.removeValidationRule("isPasswordMatch");
    };
  });
  const reset = () => {
    setProfile({ ...origin });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const fields = {};
    for (const [key, value] of Object.entries(profile)) {
      if (value !== "" && key !== "confirmPassword" && key !== "password") {
        fields[key] = value;
      }
    }
    const password = profile.password;
    props.updateProfile(fields);
    props.updatePassword(password);
    setUpdated(true);
    reset();
  };

  const handleChange = (event) => {
    const newProfile = { ...profile };
    newProfile[event.target.name] = event.target.value;
    setProfile(newProfile);
    if (updated) setUpdated(false);
  };

  const handleAvatarChange = (e) => {
    const image = e.target.files[0];
    if (image === "" || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    props.updateAvatar(formData);
  };

  const handleLinkAccount = () => {
    props.setStatus(LINK_ACCOUNT);
  };

  const handleUnlinkAccount = () => {
    const did = props.unlinkAccount(props.user.userId);
    if (did) {
      alert("Successfully unlinked your OAuth account!");
    }
  };
  return (
    <>
      <Header />
      {props.user.status !== LOGGED_IN ? <Navigate to="/" /> : <></>}
      <OutContainer>
        <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
          {updated && (
            <Alert severity="success">Successfully updated your profile!</Alert>
          )}
          <Paper
            variant="outlined"
            sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
          >
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              Profile
            </Typography>
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                alt={props.user.userName}
                src={props.user.photoURL}
                sx={{ width: 56, height: 56 }}
                algin="center"
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  onChange={handleAvatarChange}
                  accept="image/*"
                  type="file"
                  name="image"
                />
                <CameraIcon sx={{ width: 24, height: 24 }} />
              </IconButton>
              <ValidatorForm
                onSubmit={handleSubmit}
                onError={(errors) => console.log(errors)}
              >
                <React.Fragment>
                  <Grid container spacing={3}>
                    <Grid item sm={6}>
                      <Typography variant="h6">
                        User Name: {props.user.userName}
                      </Typography>
                      <TextValidator
                        disabled
                        id="userName"
                        name="userName"
                        label="Not Editable"
                        fullWidth
                        value={profile.userName}
                        onChange={handleChange}
                        variant="standard"
                        validators={["matchRegexp:^[a-zA-Z0-9_\\.]+$"]}
                        errorMessages={["username is not valid"]}
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="h6">
                        Email: {props.user.email}
                      </Typography>
                      <TextValidator
                        id="email"
                        name="email"
                        label="Email"
                        fullWidth
                        value={profile.email}
                        onChange={handleChange}
                        variant="standard"
                        validators={["isEmail"]}
                        errorMessages={["email is not valid"]}
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="h6">
                        Phone: {props.user.phone}
                      </Typography>
                      <TextValidator
                        id="phone"
                        name="phone"
                        label="Phone Number"
                        fullWidth
                        value={profile.phone}
                        onChange={handleChange}
                        variant="standard"
                        validators={[
                          "matchRegexp:^\\(?(\\d{3})\\)?[- ]?(\\d{3})[- ]?(\\d{4})$",
                        ]}
                        errorMessages={["not a valid US number"]}
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="h6">
                        Zipcode: {props.user.zipcode}
                      </Typography>
                      <TextValidator
                        id="zipcode"
                        name="zipcode"
                        label="Zipcode"
                        fullWidth
                        value={profile.zipcode}
                        onChange={handleChange}
                        variant="standard"
                        validators={[
                          "matchRegexp:(^\\d{5}$)|(^\\d{5}-\\d{4}$)$",
                        ]}
                        errorMessages={["zipcode is not valid"]}
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="h6">Password</Typography>
                      <TextValidator
                        id="password"
                        name="password"
                        label="Password"
                        fullWidth
                        variant="standard"
                        type="password"
                        value={profile.password}
                        onChange={handleChange}
                        validators={["matchRegexp:^[A-Za-z]\\w{5,14}$"]}
                        errorMessages={[
                          "6 to 15 characters of only letters, digits, '_' and start with a letter",
                        ]}
                      />
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="h6">Confirm Password</Typography>
                      <TextValidator
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        fullWidth
                        variant="standard"
                        type="password"
                        value={profile.confirmPassword}
                        onChange={handleChange}
                        validators={["isPasswordMatch"]}
                        errorMessages={["password mismatch"]}
                      />
                    </Grid>
                    <Grid container justifyContent="flex-end">
                      {props.user.provider === "google" ? (
                        props.user.isLinked ? (
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ mt: 3, mb: 2, mr: 2 }}
                            onClick={handleUnlinkAccount}
                          >
                            Unlink Account
                          </Button>
                        ) : (
                          <Button
                            onClick={handleLinkAccount}
                            variant="outlined"
                            sx={{ mt: 3, mb: 2, mr: 2 }}
                          >
                            <Link style={{ textDecoration: "none" }} to="/">
                              Link Account
                            </Link>
                          </Button>
                        )
                      ) : (
                        <></>
                      )}

                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Update
                      </Button>
                    </Grid>
                  </Grid>
                </React.Fragment>
              </ValidatorForm>
            </Box>
          </Paper>
        </Container>
      </OutContainer>
    </>
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
  updateProfile: (fields) => apiPutProfile(fields, dispatch),
  updatePassword: (password) => apiChangePassword(password, dispatch),
  updateAvatar: (formData) => apiUpdateAvatar(formData, dispatch),
  setStatus: (status) => dispatch(setStatus(status)),
  unlinkAccount: (userId) => apiUnlinkAccount({ userId }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
