import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Alert } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { connect } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { LINK_ACCOUNT, LOGGED_IN, NOT_FOUND } from "../../reducers";
import { apiLinkAccount, apiSignIn, url } from "../../apis/api";
import Google from "@mui/icons-material/Google";

const theme = createTheme();

function SignIn(props) {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userName = data.get("userName");
    const password = data.get("password");
    if (props.user.status === LINK_ACCOUNT) {
      return await props.linkAccount({
        userName,
        password,
        googleId: props.user.userId,
      });
    }
    await props.signIn(userName, password);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        {props.user.status === LOGGED_IN && <Navigate to="/home" />}
        {props.user.status === NOT_FOUND && (
          <Alert severity="error">Wrong user name or password!</Alert>
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
            Sign in
          </Typography>
          <Box>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="Account Name"
                name="userName"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
            </Box>
            <Box justifyContent="center">
              <Grid item sx={{ mb: 2 }}>
                <form
                  style={{ display: "inline" }}
                  action={url("/auth/google")}
                  method="get"
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Google />}
                    type="submit"
                  >
                    Google Sign In
                  </Button>
                </form>
              </Grid>
            </Box>
          </Box>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state,
  };
};

const mapDispatchToProps = (dispatch) => ({
  signIn: (userName, password) => apiSignIn(userName, password, dispatch),
  linkAccount: (payload) => apiLinkAccount(payload, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
