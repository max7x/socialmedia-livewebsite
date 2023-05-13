import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { connect } from "react-redux";
import { useState, useEffect } from "react";
import { Alert } from "@mui/material";
import { Link } from "react-router-dom";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { apiRegister } from "../../apis/api";

const theme = createTheme();

function SignUp(props) {
  const [user, setUser] = useState({
    password: "",
    confirmPassword: "",
    email: "",
    userName: "",
  });
  const [registered, setRegistered] = useState(false);
  const [nameHelperText, setNameHelperText] = useState("");
  const [nameError, setNameError] = useState(false);
  const reset = () => {
    setUser({
      password: "",
      confirmPassword: "",
      email: "",
      userName: "",
    });
    setNameHelperText("");
    setNameError(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await apiRegister(user.userName, user.password, user.email);
    if (result === "duplicate") {
      setNameError(true);
      setNameHelperText("username already exists");
      return;
    }
    if (result === 'success') {
      setRegistered(true);
      reset();
    }
  };

  const handleChange = (event) => {
    const newUser = { ...user };
    newUser[event.target.name] = event.target.value;
    setUser(newUser);
    setNameError(false);
    setNameHelperText('');
  };

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
      return value === user.password;
    });
    return () => {
      ValidatorForm.removeValidationRule("isPasswordMatch");
    };
  });

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {registered && (
          <Alert severity="success">
            Successfully sign up! Log in from the sign-in page!
          </Alert>
        )}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <ValidatorForm
            onSubmit={handleSubmit}
            onError={(errors) => console.log(errors)}
          >
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextValidator
                    name="userName"
                    required
                    fullWidth
                    id="userName"
                    label="User Name"
                    onChange={handleChange}
                    value={user.userName}
                    helperText={nameHelperText}
                    error={nameError}
                    autoFocus
                    validators={[
                      "matchRegexp:^[a-zA-Z0-9_\\.]+$",
                    ]}
                    errorMessages={[
                      "username is not valid",
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={user.email}
                    autoComplete="email"
                    validators={["required", "isEmail"]}
                    onChange={handleChange}
                    errorMessages={[
                      "this field is required",
                      "email is not valid",
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    fullWidth
                    required
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    onChange={handleChange}
                    autoComplete="new-password"
                    validators={["required", "matchRegexp:^[A-Za-z]\\w{5,14}$"]}
                    errorMessages={[
                      "this field is required",
                      "6 to 15 characters of only letters, digits, '_' and start with a letter",
                    ]}
                    value={user.password}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    fullWidth
                    required
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    validators={["isPasswordMatch", "required"]}
                    errorMessages={[
                      "password mismatch",
                      "this field is required",
                    ]}
                    onChange={handleChange}
                    value={user.confirmPassword}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </ValidatorForm>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state,
    userList: state.userList,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
