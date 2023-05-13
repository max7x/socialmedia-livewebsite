import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const Container = styled.div`
  padding: 0px;
`;

const Nav = styled.nav`
  max-width: 1128px;
  margin: auto;
  padding: 12px 0 16px;
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  flex-wrap: nowrap;
  & > a {
    width: 135px;
    height: 34px;
    @media (min-width: 768px) {
      padding: 0 5px;
    }
    img {
      height: 34px;
    }
  }
`;

const Join = styled.span`
  font-size: 16px;
  padding: 10px 12px;
  text-decoration: none;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.6);
  margin-right: 12px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
    color: rgba(0, 0, 0, 0.9);
    text-decoration: none;
    cursor: pointer;
  }
  a {
    outline: none;
    text-decoration: none;
    color: rgba(0, 0, 0, 0.6);
  }
`;

const SignInBtn = styled.span`
  box-shadow: inset 0 0 0 1px #9c27b0;
  color: #9c27b0;
  border-radius: 24px;
  transition-duration: 167ms;
  font-size: 16px;
  font-weight: 600;
  line-height: 40px;
  padding: 10px 24px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0);
  &:hover {
    background-color: #ebcdf0;
    color: #9c27b0;
    text-decoration: none;
    cursor: pointer;
  }
  a {
    outline: none;
    text-decoration: none;
    color: #9c27b0;
  }
`;

const Landing = () => {
  return (
    <Container>
      <Nav>
        <a href="/">
          <img src="/images/livedin.svg" alt="login-logo" />
        </a>
        <div>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <Join>Join Now</Join>
          </Link>
          <Link to="/" style={{ textDecoration: "none" }}>
            <SignInBtn>Sign In</SignInBtn>
          </Link>
        </div>
      </Nav>
    </Container>
  );
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
