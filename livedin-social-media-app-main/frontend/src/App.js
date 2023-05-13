import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/landing/Landing";
import Home from "./components/home/Home";
import SignIn from "./components/landing/SignIn";
import SignUp from "./components/landing/SignUp";
import { connect } from "react-redux";
import Profile from "./components/profile/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                <Landing />
                <SignIn />
              </>
            }
          ></Route>
          <Route
            exact
            path="/register"
            element={
              <>
                <Landing />
                <SignUp />
              </>
            }
          ></Route>
          <Route exact path="/home" element={<Home />}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
